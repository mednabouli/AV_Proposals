import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — AVProposal.ai",
  description: "Créez et gérez vos propositions AV.",
};

export default async function DashboardPage() {
  // Ensure profile exists on first visit
  const { userId } = await auth();
  if (userId) {
    await ensureProfile();
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/30 md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m16 3 5 5-5 5" />
              <path d="M8 21 3 16l5-5" />
              <path d="m21 8-8 13" />
              <path d="M3 16 11 3" />
            </svg>
          </div>
          <span className="text-sm font-semibold">
            AV<span className="text-primary">Proposal</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-colors"
            id="sidebar-new"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau devis
          </Link>
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            id="sidebar-history"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Historique
          </Link>
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            id="sidebar-templates"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Templates
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </header>

        {/* Empty state */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="12" y1="12" x2="12" y2="18" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">
              Créer ton premier devis en 3 minutes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Colle ton brief client, remplis quelques champs, et obtiens une proposition professionnelle prête à envoyer.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              id="empty-state-cta"
            >
              + Nouveau devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
