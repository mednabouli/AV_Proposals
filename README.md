# AVProposal.ai

AI-powered proposal generator for AV & video freelancers/agencies in Montréal, Québec.

Turn a messy client brief (email, notes, RFP) into a clean, priced, French/English proposal in < 10 minutes.

## Stack

| Service | Purpose |
|---|---|
| Next.js + TypeScript | Frontend & API routes |
| Tailwind + shadcn/ui | Styling & components |
| Supabase | Database, storage, RLS |
| Clerk | Auth (sign-in, sign-up) |
| Stripe | Payments & subscriptions |
| Anthropic (Claude) | AI proposal generation |
| Pinecone | Vector DB (templates, snippets) |
| Upstash Redis | Rate limiting |
| Resend | Transactional emails |
| PostHog | Product analytics |
| Sentry | Error tracking |
| Vercel | Hosting (preview + prod) |
| Cloudflare | DNS / proxy |
| Namecheap | Domain |

## Dev Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Required for local dev (minimum)

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same location |
| `SUPABASE_SERVICE_ROLE_KEY` | Same location (keep secret!) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Same location |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com) |

### Required for billing

| Variable | Source |
|---|---|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://stripe.com) → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` | Stripe → Products → Price ID |

### Required for full features

| Variable | Source |
|---|---|
| `PINECONE_API_KEY` | [Pinecone Console](https://app.pinecone.io) |
| `UPSTASH_REDIS_REST_URL` | [Upstash Console](https://console.upstash.com) |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com) |
| `NEXT_PUBLIC_POSTHOG_KEY` | [PostHog](https://posthog.com) → Settings |
| `SENTRY_DSN` | [Sentry](https://sentry.io) → Project Settings |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Landing page
│   ├── pricing/page.tsx    # Pricing page
│   └── app/page.tsx        # Dashboard (protected)
├── components/
│   ├── navbar.tsx          # Global navbar
│   ├── footer.tsx          # Global footer
│   └── ui/                 # shadcn/ui components
└── lib/
    └── utils.ts            # Utility functions
```

## License

Private — All rights reserved.
