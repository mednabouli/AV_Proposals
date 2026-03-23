# Middleware 500 Error — Diagnosis & Fix Plan

## Problem Summary

**Error**: `500: INTERNAL_SERVER_ERROR - MIDDLEWARE_INVOCATION_FAILED`  
**Cause**: Middleware is executing code that cannot run in Vercel's Edge Runtime  
**Impact**: All requests fail, entire app is down

---

## Root Cause Analysis

### Why This Happens on Vercel (But Not Locally)

Vercel runs Next.js middleware in an **Edge Runtime** environment (not Node.js):
- **Edge Runtime Restrictions**:
  - No file system access
  - No synchronous operations (some)
  - Limited environment variable access at runtime
  - Different module resolution
  - Cannot dynamically import modules that aren't tree-shakeable

### Likely Culprits in Our Code

**🔴 PRIMARY SUSPECT: Sentry Integration**
- `@sentry/nextjs` tries to initialize on module load
- Sentry SDK has Vercel-specific detection code
- If Sentry initialization fails, it crashes the entire middleware

**🟡 SECONDARY SUSPECTS:**
- PostHog SDK (similar issue with client initialization)
- Lazy imports that fail in Edge Runtime
- Missing environment variables during build
- Clerk API calls in middleware without proper async handling

---

## Diagnostic Steps

### Step 1: Check Vercel Logs
```bash
# View deployment details
# Go to: https://vercel.com/dashboard/avproposal
# → Select latest deployment
# → Click "Deployments" tab
# → View "Functions" and "Edge Logs"
# → Look for middleware.ts errors
```

### Step 2: Test Locally
```bash
# Build should work but might hide issues
npm run build

# Start production server
npm run start

# Try accessing the site
curl https://localhost:3000
```

### Step 3: Check Environment Variables
```bash
# Make sure all 17 vars are set in Vercel
# Dashboard → Settings → Environment Variables
# Required by Sentry:
# - NEXT_PUBLIC_SENTRY_DSN
```

---

## Fix Strategy

### Solution 1: Remove Sentry from Middleware Path (RECOMMENDED)

**Problem**: Sentry initialization is running when middleware loads  
**Solution**: Only initialize Sentry in client/server contexts, NOT middleware

**Why This Works**:
- Middleware has strict Edge Runtime constraints
- Sentry is for error tracking (not needed in middleware)
- We can initialize Sentry in `instrumentation.ts` (runs in Node runtime) instead

**Implementation**:

1. **Create instrumentation file** (Node.js runtime)
   - Initialize Sentry here (safe context)
   - Runs before app starts

2. **Keep middleware clean** (Edge runtime)
   - Just auth checks
   - No SDK initialization

### Solution 2: Ensure No SDK Auto-Imports in Middleware

**Problem**: SDK modules auto-initializing on import  
**Solution**: Lazy initialization pattern

```typescript
// ❌ WRONG - Initializes when middleware loads
import * as Sentry from "@sentry/nextjs";

// ✅ RIGHT - Only initializes when called
if (condition) {
  const Sentry = await import("@sentry/nextjs");
  // use Sentry
}
```

### Solution 3: Verify All Env Vars Are Set

**Problem**: Missing env vars cause module initialization to fail  
**Solution**: Set all 17 vars in Vercel + use fallbacks

---

## Implementation Plan

### Phase 1: Fix the Middleware (Critical Path)

**File**: `src/middleware.ts`  
**Current State**: Simple auth check (looks safe)  
**Action**: Keep as-is, but ensure no dependencies fail

**File**: Create `src/instrumentation.ts` (NEW)  
**Action**: Move Sentry init here (Node runtime context)

**Files to Clean Up**:
- Remove any Sentry imports from `middleware.ts`
- Remove auto-initialization from lazy clients

### Phase 2: Verify Environment Configuration

**Action Items**:
1. Check Vercel Project Settings → Environment Variables
2. Verify all 17 variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL` ✓
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
   - `SUPABASE_SERVICE_ROLE_KEY` ✓
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ✓
   - `CLERK_SECRET_KEY` ✓
   - `ANTHROPIC_API_KEY` ✓
   - `STRIPE_SECRET_KEY` ✓
   - `STRIPE_WEBHOOK_SECRET` ✓
   - `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` ✓
   - `PINECONE_API_KEY` ✓
   - `PINECONE_ENVIRONMENT` ✓
   - `PINECONE_INDEX` ✓
   - `UPSTASH_REDIS_REST_URL` ✓
   - `UPSTASH_REDIS_REST_TOKEN` ✓
   - `RESEND_API_KEY` ✓
   - `FROM_EMAIL` ✓
   - `NEXT_PUBLIC_SENTRY_DSN` ⚠️ (May be missing!)
   - `NEXT_PUBLIC_POSTHOG_API_KEY` ⚠️ (May be missing!)

### Phase 3: Build & Test

```bash
# Local verification
npm run build  # Should pass
npm run start  # Test locally

# Push to GitHub
git add .
git commit -m "Fix: Refactor Sentry init to instrumentation.ts"
git push

# Vercel auto-deploys
# Monitor: https://vercel.com/dashboard
```

### Phase 4: Verify Deployment

- ✅ Deployment completes without 500 error
- ✅ Can access landing page (`/`)
- ✅ Can sign up without errors
- ✅ Dashboard loads after auth
- ✅ No 500 errors in Vercel Function logs

---

## Timeline

| Phase | Task | Time | Effort |
|-------|------|------|--------|
| **1** | Create `instrumentation.ts` | 10 min | Low |
| **1** | Review middleware imports | 5 min | Low |
| **1** | Clean up SDK initialization | 15 min | Low |
| **2** | Verify env vars in Vercel | 10 min | Low |
| **3** | Build & test locally | 5 min | Low |
| **3** | Push to GitHub | 2 min | Low |
| **4** | Wait for Vercel deployment | 3 min | Waiting |
| **4** | Verify no 500 errors | 5 min | Low |
| **TOTAL** | | ~55 min | Low |

---

## Next Steps After Fix

Once middleware is working:

1. **Phase 1: UI/UX Audit** (30 min)
   - Check all forms for validation feedback
   - Verify loading states
   - Test error messages
   - Check mobile responsiveness

2. **Phase 2: Codebase Quality Audit** (1 hour)
   - Remove unused imports
   - Check error handling coverage
   - Performance review
   - Type safety improvements

3. **Phase 3: Generate Report** (15 min)
   - Document all findings
   - Prioritize improvements
   - Create tickets for next sprint

---

## Contingency Plans

### If Fix Doesn't Work (500 Still Shows)

**Debug Step 1**: Check Vercel Function Logs
```
Vercel Dashboard → Deployments → [Latest] → Functions → middleware.ts
Read error message carefully
```

**Debug Step 2**: Verify Build Success
```bash
# Re-check local build
npm run build 2>&1 | tail -50
```

**Debug Step 3**: Check Clerk Configuration
- Ensure Clerk domains are configured
- Add production domain to Clerk console

**Debug Step 4**: Disable Optional Services
- Temporarily disable PostHog
- Temporarily disable Sentry
- Deploy and test
- Re-enable one by one

### If Specific Service Fails

- **Sentry**: Already optional (checks for DSN)
- **PostHog**: Already lazy-loaded
- **Stripe**: Optional (only used in /api/billing/checkout)
- **Supabase**: Must work (required by middleware indirectly)
- **Clerk**: Must work (required by middleware directly)

---

## Success Criteria

- [ ] `npm run build` completes without errors
- [ ] `npm run start` runs locally without issues
- [ ] Vercel deployment succeeds
- [ ] No 500 errors in production logs
- [ ] Landing page loads
- [ ] Sign-up flow works
- [ ] Dashboard accessible after login
- [ ] Can create and submit proposal form

---

## Documentation

See also:
- `docs/deployment-guide.md` — Environment setup
- `docs/launch-checklist.md` — Pre-launch QA
- `README.md` — Quick start guide
