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

## Deployment

### Step 1: Push to GitHub

```bash
# Initialize git repo (if not already done)
git init
git add .
git commit -m "Initial commit: AVProposal.ai"

# Create a new repo on GitHub.com and add remote
git remote add origin https://github.com/YOUR_USERNAME/av-proposals.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in / sign up
2. Click **"New Project"** → **"Import Git Repository"**
3. Select the `av-proposals` repo from GitHub
4. **Configure project**:
   - **Framework**: Next.js
   - **Root Directory**: `./` (default)
   - Build command: `npm run build` (auto-detected)
5. **Add environment variables** (copy from `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `ANTHROPIC_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`
   - `PINECONE_API_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `NEXT_PUBLIC_POSTHOG_API_KEY`
   - `NEXT_PUBLIC_POSTHOG_API_HOST`
   - `NEXT_PUBLIC_SENTRY_DSN`
6. Click **"Deploy"** → Wait for build to complete
7. You'll get a preview URL: `https://av-proposals.vercel.app`

### Step 3: Configure Domain & Cloudflare

#### Option A: Buy domain on Namecheap

1. Go to [namecheap.com](https://namecheap.com)
2. Search and buy domain (e.g., `avproposal.ai`)
3. In Namecheap, go to **Domain List** → Your domain → **DNS Settings**
4. Change nameservers to Cloudflare (see below)

#### Option B: Add domain to Cloudflare

1. Go to [cloudflare.com](https://cloudflare.com) and sign in / create account
2. Click **"Add Site"** → Enter your domain (e.g., `avproposal.ai`)
3. Select **Free** plan
4. Cloudflare gives you 2 nameservers:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
5. Update Namecheap **Nameserver 1-2** to these Cloudflare nameservers
6. Wait 24h for DNS propagation

#### Connect Vercel to domain

1. In Vercel project settings → **Domains**
2. Add domain: `avproposal.ai` and `www.avproposal.ai`
3. Vercel shows CNAME records to add
4. In Cloudflare dashboard → **DNS** → Add CNAME records:
   - Name: `www` → Value: `cname.vercel-dns.com`
   - (Or follow Vercel's exact instructions)
5. Wait for DNS to resolve (5 min - 24h)

#### Enable HTTPS in Cloudflare

1. **Cloudflare dashboard** → **SSL/TLS** → Set to **Full (Strict)**
2. This enables automatic HTTPS via Vercel's SSL

### Step 4: Update Clerk & Stripe URLs

After domain is live, update redirect URIs in each service:

**Clerk** (clerk.com → Settings → Authorized Domains):

- Add: `https://avproposal.ai`
- Add: `https://www.avproposal.ai`

**Stripe** (stripe.com → Settings → Redirect URLs):

- Add: `https://avproposal.ai/app/billing`
- Add: `https://www.avproposal.ai/app/billing`

**Stripe Webhook Endpoint** (stripe.com → Webhooks):

- Endpoint URL: `https://avproposal.ai/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Step 5: Production Checklist

- [ ] Build passes: `npm run build`
- [ ] Env vars set in Vercel
- [ ] GitHub repo created & main branch protected
- [ ] Domain configured & DNS resolves
- [ ] Clerk URLs updated
- [ ] Stripe URLs updated
- [ ] Test sign-up flow on production domain
- [ ] Test proposal generation
- [ ] Test Stripe checkout
- [ ] Monitor Sentry for errors
- [ ] Check PostHog events firing

## License

Private — All rights reserved.
