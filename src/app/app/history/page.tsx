import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { EmptyProposalsState } from "@/components/empty-states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historique — AVProposal.ai",
  description: "Historique de vos propositions AV.",
};

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/30 md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <Link href="/app" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg min-h-[44px]" aria-label="Dashboard Accueil">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="m16 3 5 5-5 5" />
                <path d="M8 21 3 16l5-5" />
                <path d="m21 8-8 13" />
                <path d="M3 16 11 3" />
              </svg>
            </div>
            <span className="text-sm font-semibold">
              AV<span className="text-primary">Proposal</span>
            </span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <Link
            href="/app"
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="sidebar-home"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/app/new"
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="sidebar-new"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau devis
          </Link>
          <Link
            href="/app/history"
            aria-current="page"
            className="flex min-h-[44px] items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="sidebar-history"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Historique
          </Link>
          <Link
            href="/app/templates"
            className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="sidebar-templates"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <h1 className="text-lg font-semibold">Historique des devis</h1>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
              },
            }}
          />
        </header>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center p-8">
          {/* For now we show empty state */}
          <EmptyProposalsState />
        </div>
      </div>
    </div>
  );
}
