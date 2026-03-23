import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export async function Navbar() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex min-h-[44px] items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" 
          id="navbar-logo"
          aria-label="Accueil AVProposal.ai"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 transition-colors duration-200 group-hover:bg-primary/30">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m16 3 5 5-5 5" />
              <path d="M8 21 3 16l5-5" />
              <path d="m21 8-8 13" />
              <path d="M3 16 11 3" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AV<span className="text-primary">Proposal</span>.ai
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/#features"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="nav-features"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="nav-pricing"
          >
            Tarifs
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="hidden inline-flex min-h-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex"
                id="nav-login"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                id="nav-signup"
              >
                Commencer gratuitement
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/app"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                id="nav-dashboard"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
