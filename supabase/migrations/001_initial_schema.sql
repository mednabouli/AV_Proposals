-- =============================================
-- AVProposal.ai — Supabase Migration v0
-- =============================================
-- Run this in Supabase SQL Editor or as a migration.
-- Prerequisites: Supabase project created, pgcrypto extension enabled (default).

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Profiles (linked to Clerk user)
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id   TEXT UNIQUE NOT NULL,
  name            TEXT,
  company_name    TEXT,
  role            TEXT DEFAULT 'freelance',
  default_language TEXT DEFAULT 'fr',
  timezone        TEXT DEFAULT 'America/Montreal',
  currency        TEXT DEFAULT 'CAD',
  is_onboarded    BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal templates (reusable section structures)
CREATE TABLE IF NOT EXISTS proposal_templates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  sections_config   JSONB DEFAULT '[]',
  is_default        BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals (generated documents)
CREATE TABLE IF NOT EXISTS proposals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name       TEXT,
  client_company    TEXT,
  project_type      TEXT,
  budget_range      TEXT,
  location          TEXT DEFAULT 'Montréal',
  raw_brief         TEXT,
  generated_content JSONB,
  language          TEXT DEFAULT 'fr',
  status            TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Billing plans (seeded: Free, Pro)
CREATE TABLE IF NOT EXISTS billing_plans (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_price_id           TEXT UNIQUE,
  name                      TEXT NOT NULL,
  monthly_price_cents       INTEGER NOT NULL DEFAULT 0,
  max_generations_per_month INTEGER NOT NULL DEFAULT 5,
  has_pdf_export            BOOLEAN DEFAULT FALSE,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions (one active per user)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  plan_id                 UUID NOT NULL REFERENCES billing_plans(id),
  status                  TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Usage logs (track generation, export events)
CREATE TABLE IF NOT EXISTS usage_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id   UUID REFERENCES proposals(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL CHECK (event_type IN ('generation', 'regeneration', 'export')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_owner ON proposals(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(owner_profile_id, status);
CREATE INDEX IF NOT EXISTS idx_proposal_templates_owner ON proposal_templates(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_profile ON user_subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_profile ON usage_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(profile_id, created_at);

-- =============================================
-- SEED DATA: Billing Plans
-- =============================================
INSERT INTO billing_plans (name, monthly_price_cents, max_generations_per_month, has_pdf_export, stripe_price_id)
VALUES
  ('Free', 0, 5, FALSE, NULL),
  ('Pro', 3900, 999999, TRUE, NULL)  -- stripe_price_id to be set after Stripe setup
ON CONFLICT (stripe_price_id) DO NOTHING;

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE TRIGGER set_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE OR REPLACE TRIGGER set_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================
-- RLS POLICIES
-- =============================================
-- Note: These policies use the Clerk JWT claim `sub` as the user identifier.
-- In Supabase, configure the JWT secret from Clerk to validate tokens.
-- The helper function below extracts the Clerk user ID from the JWT.

CREATE OR REPLACE FUNCTION requesting_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::jsonb ->> 'sub');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM profiles
    WHERE clerk_user_id = requesting_clerk_user_id()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;

-- profiles: users can only read/update their own profile
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (clerk_user_id = requesting_clerk_user_id());
CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (clerk_user_id = requesting_clerk_user_id());
-- Insert is handled by the server (service role) on first login

-- proposals: users see only their own
CREATE POLICY proposals_select ON proposals FOR SELECT
  USING (owner_profile_id = current_profile_id());
CREATE POLICY proposals_insert ON proposals FOR INSERT
  WITH CHECK (owner_profile_id = current_profile_id());
CREATE POLICY proposals_update ON proposals FOR UPDATE
  USING (owner_profile_id = current_profile_id());
CREATE POLICY proposals_delete ON proposals FOR DELETE
  USING (owner_profile_id = current_profile_id());

-- proposal_templates: users see own + system defaults
CREATE POLICY templates_select ON proposal_templates FOR SELECT
  USING (owner_profile_id = current_profile_id() OR is_default = TRUE);
CREATE POLICY templates_insert ON proposal_templates FOR INSERT
  WITH CHECK (owner_profile_id = current_profile_id());
CREATE POLICY templates_update ON proposal_templates FOR UPDATE
  USING (owner_profile_id = current_profile_id());
CREATE POLICY templates_delete ON proposal_templates FOR DELETE
  USING (owner_profile_id = current_profile_id() AND is_default = FALSE);

-- user_subscriptions: users see their own
CREATE POLICY subscriptions_select ON user_subscriptions FOR SELECT
  USING (profile_id = current_profile_id());

-- usage_logs: users see their own
CREATE POLICY usage_logs_select ON usage_logs FOR SELECT
  USING (profile_id = current_profile_id());

-- billing_plans: anyone authenticated can read
CREATE POLICY billing_plans_select ON billing_plans FOR SELECT
  USING (TRUE);
