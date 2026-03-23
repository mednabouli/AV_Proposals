import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m16 3 5 5-5 5" />
              <path d="M8 21 3 16l5-5" />
              <path d="m21 8-8 13" />
              <path d="M3 16 11 3" />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AVProposal.ai — Montréal, QC
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/pricing" className="inline-flex min-h-[44px] items-center transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
            Tarifs
          </Link>
          <a href="mailto:hello@avproposal.ai" className="inline-flex min-h-[44px] items-center transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
