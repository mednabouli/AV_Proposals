# Deployment Guide — AVProposal.ai

Complete step-by-step instructions for deploying AVProposal.ai to production.

**Estimated time**: 1–2 hours (mostly waiting for DNS propagation)

---

## Phase 1: GitHub Repository (15 min)

### 1.1 Create GitHub repo

```bash
# Navigate to project directory
cd ~/Documents/GitHub/AV_Proposals

# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: AVProposal.ai MVP with auth, AI generation, and billing"

# Create repo on github.com → "New" → fill in:
# - Repo name: av-proposals
# - Description: "AI-powered proposal generator for AV freelancers"
# - Public or Private: Private (for now)
# - Initialize: No (already have .git)

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/av-proposals.git
git branch -M main
git push -u origin main
```

### 1.2 Protect main branch

On GitHub.com:
1. Go to **Settings** → **Branches**
2. Add rule for `main`:
   - ✓ Require pull request reviews
   - ✓ Dismiss stale PR approvals
   - ✓ Require branches to be up to date

---

## Phase 2: Vercel Deployment (30 min)

### 2.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click **"New Project"**
4. Select **"Import Git Repository"**
5. Search for `av-proposals` → Click **"Import"**

### 2.2 Configure build settings

Default settings should be fine:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add environment variables

In Vercel project settings → **Environment Variables**, add all vars from `.env.local`:

**Core Services:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
```

**AI & Vector DB:**
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=us-west-2-aws
PINECONE_INDEX=av-proposals
```

**Billing:**
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxxxx
```

**Rate Limiting:**
```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

**Telemetry:**
```
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@avproposal.ai
NEXT_PUBLIC_POSTHOG_API_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_API_HOST=https://us.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 2.4 Deploy

Click **"Deploy"** → Wait for build to complete

Once live, you'll get preview URL: `https://av-proposals.vercel.app`

**Test it:**
- Visit the URL
- Try signing up with Clerk
- Verify email is set in Clerk dashboard
- Check that profile created in Supabase

---

## Phase 3: Domain Setup (1–2 hours, mostly waiting)

### 3.1 Purchase domain

**Option A: Namecheap** (cheapest)
1. Go to [namecheap.com](https://namecheap.com)
2. Search `avproposal.ai` (or your domain)
3. Add to cart → Checkout
4. **IMPORTANT**: Turn OFF "Auto-renew" if you want to review before next renewal
5. Complete purchase

**Option B: Other registrars**
- Google Domains (integrates with Cloudflare automatically)
- GoDaddy (more expensive, but user-friendly)
- Gandi (good for EU users)

### 3.2 Switch to Cloudflare nameservers

In **Namecheap Dashboard** → **Domain List** → Your domain → **Nameservers**:

Change from "Namecheap BasicDNS" to **Custom DNS** and enter Cloudflare's nameservers:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

(Or any 2 of Cloudflare's listed nameservers)

Click **Save** → Wait 5 min for Namecheap to process

### 3.3 Set up Cloudflare

1. Go to [cloudflare.com](https://cloudflare.com) → Sign up / Log in
2. **Add site** → Enter your domain name → **Add site**
3. Select **Free** plan
4. Cloudflare will show the nameservers to add (copy them)
5. In Namecheap, set these as custom nameservers (see 3.2)
6. Click **Done** in Cloudflare
7. **Wait 24–48 hours** for DNS to fully propagate

### 3.4 Add Vercel domain to Cloudflare

Once Cloudflare is managing your domain:

**In Vercel** (project settings → Domains):
1. Click **"Add Custom Domain"**
2. Enter: `avproposal.ai`
3. Choose: **"Use Cloudflare's nameservers"** (if option appears)
4. OR manually add CNAME in Cloudflare:
   - **DNS Records** → **Add Record**
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **Proxied** (orange cloud)
   - TTL: Auto
   - Click **Save**

### 3.5 Verify DNS resolution

```bash
# Test DNS resolution (wait 5-30 min after changes)
nslookup avproposal.ai
dig avproposal.ai

# Should show Vercel's IP
```

### 3.6 Enable HTTPS

In **Cloudflare Dashboard** → **SSL/TLS**:
- Set to **"Full (Strict)"** (not "Flexible")
- This ensures Vercel's SSL cert is used

---

## Phase 4: Service Configuration (30 min)

### 4.1 Update Clerk

1. Go to [Clerk Dashboard](https://clerk.com)
2. **Settings** → **Domains** → **Add domain**
3. Add:
   - `https://avproposal.ai`
   - `https://www.avproposal.ai`
4. Complete verification (usually automatic if DNS is set)

### 4.2 Update Stripe

1. Go to [Stripe Dashboard](https://stripe.com)
2. **Settings** → **Redirect URIs**:
   - Add: `https://avproposal.ai/app/billing`
   - Add: `https://www.avproposal.ai/app/billing`

3. **Webhooks** → Add endpoint:
   - URL: `https://avproposal.ai/api/webhooks/stripe`
   - Events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy **Signing secret** → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

4. **Billing** → Create or activate **Pro plan**:
   - Product name: "Pro Plan"
   - Price: $39/month (CAD)
   - Copy **Price ID** → Add to Vercel as `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`

### 4.3 Update PostHog (Analytics)

1. Go to [PostHog Settings](https://posthog.com/account/settings)
2. **Project Settings** → **Authorized URLs**:
   - Add: `https://avproposal.ai`
   - Add: `https://www.avproposal.ai`

### 4.4 Update Sentry (Error Tracking)

1. Go to [Sentry Project Settings](https://sentry.io)
2. **Project Settings** → **Client Keys** → **Allowed Domains**:
   - Add: `avproposal.ai`
   - Add: `www.avproposal.ai`

---

## Phase 5: Production Testing (30 min)

### 5.1 Full funnel test

- [ ] Visit `https://avproposal.ai` → Landing page loads
- [ ] Click **"Sign up"** → Clerk sign-up modal appears
- [ ] Complete sign-up → Redirects to `/app` dashboard
- [ ] Check inbox for welcome email (Resend)
- [ ] Fill proposal form → Click "Generate"
- [ ] Verify proposal generates (Claude API working)
- [ ] Click "Upgrade to Pro" → Stripe checkout appears
- [ ] Complete test payment (use Stripe test card: `4242 4242 4242 4242`)
- [ ] Verify subscription created in Stripe Dashboard
- [ ] Check inbox for upgrade confirmation email
- [ ] Verify Sentry shows no errors
- [ ] Check PostHog shows events (wait 5 min for sync)

### 5.2 Admin checks

**Supabase:**
- Go to database → Check `profiles` table has new row
- Check `proposals` table has generated rows
- Check `user_subscriptions` has Pro entry

**Stripe Dashboard:**
- Go to Customers → Find test customer
- Verify subscription status = "active"
- Verify invoice created for $39

**Sentry Dashboard:**
- Check no critical errors
- If errors exist, click to view and verify data is scrubbed

---

## Rollback Procedure

If something breaks on production:

### Quick rollback to previous version

1. In Vercel → **Deployments** → Find previous working build
2. Click **"..." → "Promote to Production"**
3. Wait for re-deployment (~2 min)

### Revert code changes

```bash
git revert <commit-hash>
git push origin main
# Vercel auto-redeploys
```

---

## Monitoring & Maintenance

### Daily

- Check Sentry for new errors
- Monitor Vercel deployment logs for 5xx errors

### Weekly

- Review PostHog analytics for signup conversion
- Check Stripe revenue dashboard
- Monitor Supabase database size

### Monthly

- Review Upstash Redis usage (rate limiting)
- Check Pinecone token usage
- Audit Clerk user list
- Test backup/restore procedures

---

## Cost Summary (First Year)

| Service | Cost | Notes |
|---|---|---|
| Domain (Namecheap) | ~$9 | Annual |
| Cloudflare | Free | With 1 domain |
| Vercel | $0–$50 | Free tier + Pro ($20/mo) if needed |
| Supabase | Free | PostgreSQL + 500MB storage |
| Clerk | ~$50 | Pay-as-you-go after free tier |
| Stripe | 2.9% + $0.30 | Per transaction |
| Resend | Free | 100 emails/day free |
| PostHog | Free | 1M events/month free |
| Sentry | Free | 5k errors/month free |
| Anthropic | ~$50 | Usage-based (~$0.003 per generation) |
| Pinecone | Free | Starter index |
| Upstash Redis | Free | 100 requests/day free |
| **Total (estimate)** | **~$150–$200** | Highly variable |

---

## Support & Troubleshooting

### DNS not resolving
- Run: `nslookup avproposal.ai` (wait 24h max)
- If still failing: Check Cloudflare nameservers in Namecheap

### Vercel deployment fails
- Check build logs in Vercel dashboard
- Ensure all env vars are set
- Run `npm run build` locally to verify

### Stripe webhook failing
- Go to Stripe Webhooks → Check logs for errors
- Verify signing secret matches `STRIPE_WEBHOOK_SECRET` in Vercel
- Test with: `curl -X POST https://avproposal.ai/api/webhooks/stripe`

### Emails not sending
- Check Resend dashboard for delivery status
- Verify `FROM_EMAIL` is configured
- Check spam folder

### High error rate
- Check Sentry for specific errors
- Review Vercel logs
- Check Supabase RLS policies if DB errors

---

## Next: Launch Checklist

See [`docs/launch-checklist.md`](./launch-checklist.md) for final pre-launch validation.
