# AVProposal.ai — Database Schema (v0)

## Entity Relationship

```mermaid
erDiagram
    profiles ||--o{ proposals : owns
    profiles ||--o{ proposal_templates : owns
    profiles ||--o| user_subscriptions : has
    profiles ||--o{ usage_logs : generates
    billing_plans ||--o{ user_subscriptions : "subscribed to"
    proposals ||--o{ usage_logs : tracked_by

    profiles {
        uuid id PK
        text clerk_user_id UK
        text name
        text company_name
        text role
        text default_language
        text timezone
        text currency
        boolean is_onboarded
        jsonb onboarding_data
        timestamp created_at
        timestamp updated_at
    }
    proposal_templates {
        uuid id PK
        uuid owner_profile_id FK
        text name
        text description
        jsonb sections_config
        boolean is_default
        timestamp created_at
    }
    proposals {
        uuid id PK
        uuid owner_profile_id FK
        text client_name
        text client_company
        text project_type
        text budget_range
        text location
        text raw_brief
        jsonb generated_content
        text language
        text status
        timestamp created_at
        timestamp updated_at
    }
    billing_plans {
        uuid id PK
        text stripe_price_id UK
        text name
        integer monthly_price_cents
        integer max_generations_per_month
        boolean has_pdf_export
        timestamp created_at
    }
    user_subscriptions {
        uuid id PK
        uuid profile_id FK
        text stripe_customer_id
        text stripe_subscription_id
        uuid plan_id FK
        text status
        timestamp current_period_start
        timestamp current_period_end
        timestamp created_at
        timestamp updated_at
    }
    usage_logs {
        uuid id PK
        uuid profile_id FK
        uuid proposal_id FK
        text event_type
        timestamp created_at
    }
```

## Tables

### `profiles`
User profile linked to Clerk. Created on first sign-in.

### `proposal_templates`
Reusable section templates per user. Can be default (system) or user-owned.

### `proposals`
Generated proposals with raw brief input and structured AI output.
- `status`: `draft` | `sent`
- `generated_content`: JSON with sections, pricing_table, assumptions, exclusions, next_steps

### `billing_plans`
Plans seeded at deploy (Free, Pro). Linked to Stripe price IDs.

### `user_subscriptions`
Active subscription per user. Updated via Stripe webhooks.

### `usage_logs`
Tracks events: `generation`, `regeneration`, `export`.

## RLS Policies

| Table | Policy | Rule |
|---|---|---|
| profiles | Users see own profile | `auth.uid() = clerk_user_id` (via Clerk JWT) |
| proposals | Users see own proposals | `owner_profile_id = current_profile_id()` |
| proposal_templates | Users see own + defaults | `owner_profile_id = current_profile_id() OR is_default = true` |
| user_subscriptions | Users see own subscription | `profile_id = current_profile_id()` |
| usage_logs | Users see own logs | `profile_id = current_profile_id()` |
| billing_plans | Public read | All authenticated users can read |

> **Note**: RLS will use a `current_profile_id()` helper function that resolves the Clerk JWT claim to a profile UUID.
