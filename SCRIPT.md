# SCRIPT.md — Build Script for AVProposal.ai

This script is the playbook for Claude Code agents.
Follow tasks IN ORDER where possible. Each task should end in:
- Working build
- Short recap
- Next suggested tasks

=====================================================================
STAGE 0 — KICKOFF
=====================================================================

Task 0.1 — Confirm product spec (PRODUCT_AGENT)
- Read CLAUDE.md and AGENTS.md.
- Ask founder:
  - ICP details (freelance vs petite agence, Montréal only or wider).
  - Main proposal types (2–3).
  - Languages (FR only vs FR+EN).
  - v0 must‑haves vs later.
- Write `docs/product-spec.md` with:
  - Mission
  - User stories
  - Non‑goals
- Get explicit ✅ from founder.

Task 0.2 — Define happy path (PRODUCT_AGENT)
- In `docs/product-spec.md`, add:
  - Happy path steps from landing → first paid proposal.
  - 1–2 example scenarios (freelance, small agency).
- Confirm with founder.

=====================================================================
STAGE 1 — FOUNDATION: APP + AUTH + DB
=====================================================================

Task 1.1 — Bootstrap Next.js app (DEV_AGENT)
- Create Next.js App Router project with TypeScript.
- Add Tailwind and optionally shadcn/ui (confirm with founder).
- Create placeholder pages:
  - `/` landing
  - `/app` (protected dashboard)
  - `/pricing`
- Add basic layout with navbar and footer.
- Ensure `npm run dev` works locally.

Task 1.2 — Env var scaffold (DEV_AGENT)
- Create `.env.example` with all env vars listed in CLAUDE.md.
- Update README with:
  - Required env vars.
  - Local dev instructions.

Task 1.3 — DB schema v0 (DB_AGENT)
- Create `docs/database-schema.md` with the tables:
  - profiles
  - proposal_templates
  - proposals
  - billing_plans
  - user_subscriptions
  - usage_logs
- Generate SQL migration for Supabase (no secrets).
- Add RLS policy description (even if not full SQL yet).

Task 1.4 — Supabase integration (DB_AGENT + DEV_AGENT)
- Implement `lib/supabase/client.ts` (client) and `lib/supabase/server.ts` (server).
- Add simple test read/write flow (e.g. a health check route).
- Verify that app can talk to Supabase in local dev (mock if needed).

Task 1.5 — Clerk auth integration (DEV_AGENT)
- Configure ClerkProvider and middleware.
- Create sign‑in / sign‑up routes.
- Implement `onAuth` logic to:
  - Create profile row in Supabase on first login.
- Protect `/app` to require auth.

=====================================================================
STAGE 2 — CORE FEATURE UX
=====================================================================

Task 2.1 — Dashboard layout (DEV_AGENT)
- Build `/app` layout:
  - Sidebar with “Nouveau devis”, “Historique”, “Templates”.
  - Main content area for forms and results.
- Implement responsive layout.

Task 2.2 — New proposal form (DEV_AGENT)
- On `/app/new` (or main dashboard), create:
  - Form fields:
    - Client name/company
    - Project type (select)
    - Budget
    - Location
    - Date / duration
    - Language
    - Brief textarea
  - “Generate proposal” button.
- Add local form validation and user feedback.

Task 2.3 — Proposal persistence (DB_AGENT + DEV_AGENT)
- Implement server action / API route to:
  - Validate auth.
  - Insert a `proposals` row with raw_brief and metadata.
  - Return a placeholder response.
- Wire form submission to this endpoint (no AI yet).

=====================================================================
STAGE 3 — AI + VECTORS + RATE LIMIT
=====================================================================

Task 3.1 — AI client & prompt builder (AI_AGENT)
- Create `lib/ai/client.ts`:
  - LLM client using env var (Anthropic or OpenAI).
- Create `lib/ai/prompts.ts`:
  - System prompt for “AV proposal writer in Montréal”.
  - Function to build a prompt from:
    - profile settings
    - proposal input
    - optional template/snippet context.

Task 3.2 — Pinecone index & utils (AI_AGENT)
- Design Pinecone index:
  - Name, dimension, metadata fields.
- Implement `lib/ai/pinecone.ts`:
  - init client
  - upsertTemplateVectors()
  - queryTemplatesForProposal()
- Add a simple seeding script (dummy templates) as comments/instructions.

Task 3.3 — Upstash rate limiting (AI_AGENT + DEV_AGENT)
- Implement `lib/rate-limit.ts`:
  - checkRateLimit(profile_id, action)
- Decide policy (e.g. 10 generations/hour/user).
- Integrate check into generation endpoint (next task).

Task 3.4 — Generation endpoint (AI_AGENT + DEV_AGENT)
- Extend proposals server action:
  - Check auth and subscription/plan.
  - Check rate limit.
  - Query Pinecone for relevant templates/snippets.
  - Call LLM with structured prompt.
  - Save structured generated_content (JSON) in Supabase.
  - Return structured result to UI.

Task 3.5 — UI preview (DEV_AGENT)
- Display generated proposal in UI:
  - Sections with titles and body.
  - Pricing table.
  - Assumptions and exclusions.
- Add loading states and error handling.

=====================================================================
STAGE 4 — BILLING & PLANS
=====================================================================

Task 4.1 — Define plans (PRODUCT_AGENT + BILLING_AGENT)
- In `docs/product-spec.md`, define:
  - Free plan limits (monthly generations + features).
  - Pro plan limits and price (CAD).
- Map to Stripe products/prices (described, not created).

Task 4.2 — Stripe checkout & portal (BILLING_AGENT)
- Implement server route to create Checkout sessions.
- Implement webhook handler to update:
  - billing_plans
  - user_subscriptions
- Add billing page:
  - Display current plan and status.
  - Button “Upgrade to Pro” → Checkout.
  - Button “Manage subscription” → Stripe portal.

Task 4.3 — Enforce plan limits (BILLING_AGENT + AI_AGENT)
- In generation logic:
  - Check plan limits (max generations/month).
  - If exceeded, return clean error and redirect to upgrade flow.

=====================================================================
STAGE 5 — EMAILS, ANALYTICS, ERRORS
=====================================================================

Task 5.1 — Resend emails (TELEMETRY_AGENT)
- Implement `lib/email/resend.ts`.
- Create templates for:
  - Welcome email.
  - First proposal generated (optional).
- Trigger welcome email after onboarding.

Task 5.2 — PostHog tracking (TELEMETRY_AGENT)
- Add client snippet.
- Track events:
  - `user_signed_up`
  - `first_proposal_generated`
  - `plan_upgraded`
- Document in `docs/metrics.md`.

Task 5.3 — Sentry setup (TELEMETRY_AGENT)
- Configure Sentry for Next.js.
- Scrub sensitive fields (client names, briefs).
- Verify test errors reach Sentry.

=====================================================================
STAGE 6 — DEPLOYMENT & DOMAIN
=====================================================================

Task 6.1 — GitHub + Vercel (DEV_AGENT)
- Ensure project builds locally.
- Prepare instructions to:
  - Create GitHub repo.
  - Connect to Vercel.
  - Set env vars on Vercel.

Task 6.2 — Domain & Cloudflare (DEV_AGENT)
- Add instructions (no real creds) for:
  - Buying domain (Namecheap).
  - Adding to Cloudflare.
  - Connecting DNS to Vercel.
- Update README with steps.

=====================================================================
STAGE 7 — POLISH & LAUNCH
=====================================================================

Task 7.1 — Onboarding wizard (DEV_AGENT + PRODUCT_AGENT)
- Implement simple onboarding steps:
  - Freelance vs agency.
  - Services offered.
  - Daily rate / typical budget.
  - Default language.
- Use this info to pre‑configure templates & prompts.

Task 7.2 — Empty states & copy (PRODUCT_AGENT + DEV_AGENT)
- Add friendly empty states and CTAs.
- Polish copy in FR/EN.

Task 7.3 — Launch checklist (ALL AGENTS)
- Create `docs/launch-checklist.md` with:
  - Auth, DB, AI, billing, emails, analytics, errors, domain.
- Tick items as they are validated.

END STATE:
- AVProposal.ai live on Vercel with custom domain.
- Users can sign up, generate proposals, upgrade to Pro, and use the tool reliably.
