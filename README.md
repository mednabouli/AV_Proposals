<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=a78bfa&height=250&section=header&text=AVProposal.ai&fontSize=70&fontAlignY=35&desc=Intelligent%20proposal%20generator&descAlignY=55&descAlign=50" alt="AVProposal Banner">

  <h3>Transform a messy client brief into a clean, priced proposal in < 10 minutes.</h3>
  <p>Engineered for AV & video freelancers and agencies in Montréal, Québec.</p>

  <p align="center">
    <a href="https://avproposal.ai"><strong>View Live Demo</strong></a>
    ·
    <a href="https://github.com/mednabouli/AV_Proposals/issues">Report Bug</a>
    ·
    <a href="https://github.com/mednabouli/AV_Proposals/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Anthropic-CE6147?style=for-the-badge&logo=anthropic&logoColor=white" alt="Anthropic" />
</div>

---

<br />

## ⚡ About The Project

**AVProposal.ai** is an intelligent AI-powered business tool aimed at streamlining the proposal creation process. You feed it a chaotic email, rough notes, or an RFP from a client, and the engine handles the heavy lifting—drafting a professional, bilingual (French/English) statement of work with line-item pricing and equipment breakdowns.

## 📸 Screenshots & Live Data

<div align="center">
  <!-- Replace the placeholder URL with your actual 16:9 Hero/Dashboard Screenshot -->
  <img src="https://via.placeholder.com/800x450/1a1a2e/a78bfa?text=Landing+Page+&amp;+Hero+Section" alt="Product Screenshot 1" width="100%">
  
  <br/><br/>
  
  <!-- Replace the placeholder URLs below with vertical / mobile or specific UI states -->
  <p float="left">
    <img src="https://via.placeholder.com/390x400/1a1a2e/a78bfa?text=Quote+Builder" alt="Product Screenshot 2" width="49%">
    <img src="https://via.placeholder.com/390x400/1a1a2e/a78bfa?text=Stripe+Payments" alt="Product Screenshot 3" width="49%">
  </p>
</div>

*(Replace the placeholder URLs above with real screenshots of your application!)*

<br />

## 🛠️ Tech Stack & Services

| Technology | Purpose |
| ---------- | ------- |
| **Next.js + TypeScript** | Frontend UI & API Routes |
| **Tailwind + shadcn/ui** | Styling & accessible component system |
| **Supabase** | PostgreSQL Database, Storage & RLS |
| **Clerk** | Authentication & User Management |
| **Stripe** | Subscriptions & Webhook Payments |
| **Anthropic (Claude)** | Natural language proposal generation |
| **Pinecone** | Vector DB for snippets and context |
| **Upstash Redis** | Rate limiting rules |
| **Resend** | Transactional emails |
| **PostHog** | Product analytics & tracking |

<br />

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites & Installation

```bash
# Clone the repository
git clone https://github.com/mednabouli/AV_Proposals.git

# Install NPM packages
npm install

# Start the development server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Below are the **bare minimum** required variables to launch the app locally:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key for Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Role Key (Server-side only) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk Publishable Key |
| `CLERK_SECRET_KEY` | Secret Key for Clerk Auth |
| `ANTHROPIC_API_KEY` | API Key for Claude model generation |

*(For full functionality including billing, webhooks, and analytics, you must also provide keys for Stripe, Pinecone, Upstash, Resend, and PostHog).*

<br />

## 📂 Project Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Public landing page
│   ├── pricing/            # Public pricing page
│   └── app/                # Protected dashboard space
├── components/
│   ├── navbar.tsx          # Main Top Navbar
│   ├── footer.tsx          # Main Footer
│   └── ui/                 # Reusable shadcn/ui components
└── lib/
    └── utils.ts            # Utility functions (e.g. cn for Tailwind merge)
```

<br />

## 🌎 Deployment

The repository is configured to easily deploy to **Vercel** with a seamless CI/CD pipeline.

1. **Connect Vercel:** Import your GitHub repo in your Vercel dashboard.
2. **Environment Variables:** Provide all API keys listed in `.env.local` inside the Vercel project settings.
3. **Domain Setup (Optional):** Define custom nameservers on Namecheap/Cloudflare and generate a CNAME record connecting `avproposal.ai` to `cname.vercel-dns.com`.
4. **Authorized Redirects:** Ensure your custom domain is whitelisted in:
   - Clerk Dashboard (Settings → Authorized Domains)
   - Stripe Dashboard (Webhooks & Checkout Redirect URLs)

---

<div align="center">
  <p>Built with ❤️ for the video production community.</p>
  <p>Private — All rights reserved.</p>
</div>
