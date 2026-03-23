import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { EmptyProposalsState } from "@/components/empty-states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — AVProposal.ai",
  description: "Créez et gérez vos propositions AV.",
};

export default async function DashboardPage() {
  // Ensure profile exists on first visit
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await ensureProfile();
  
  // Redirect to onboarding if not completed
  if (profile && !profile.is_onboarded) {
    redirect("/app/onboarding");
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
          <EmptyProposalsState />
        </div>
      </div>
    </div>
  );
}
