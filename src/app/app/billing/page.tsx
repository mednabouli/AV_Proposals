import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserPlan } from "@/app/actions/billing";

// This route uses Clerk auth() which calls headers()
// Must be dynamic - cannot be prerendered statically
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const plan = await getUserPlan();

  if (!plan) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="mb-2 text-3xl font-bold">Facturation</h1>
          <p className="mb-12 text-muted-foreground">Gérez votre abonnement et votre plan</p>

          {/* Current Plan */}
          {plan && (
            <div className="mb-12 rounded-lg border border-border/50 bg-card/30 p-8">
              <h2 className="mb-4 text-lg font-semibold">Plan actuel</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Forfait</p>
                  <p className="text-2xl font-semibold">{plan.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="text-lg font-medium capitalize">
                    {plan.status === "active" ? "Actif" : plan.status}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium">Fonctionnalités :</p>
                <ul className="space-y-1">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Plans Comparison */}
          <div className="mb-12">
            <h2 className="mb-6 text-lg font-semibold">Plans disponibles</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Free Plan */}
              <div className="rounded-lg border border-border/50 bg-card/30 p-8">
                <h3 className="mb-2 text-xl font-semibold">Free</h3>
                <p className="mb-6 text-3xl font-bold">
                  $0
                  <span className="text-sm text-muted-foreground">/mois</span>
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span>5 générations/mois</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">✗</span>
                    <span className="text-muted-foreground">Export PDF</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">✗</span>
                    <span className="text-muted-foreground">Support prioritaire</span>
                  </li>
                </ul>
                {plan?.name === "Free" ? (
                  <button
                    disabled
                    className="w-full rounded-lg border border-border/50 px-4 py-2 text-sm font-medium text-foreground opacity-50"
                  >
                    Plan actuel
                  </button>
                ) : (
                  <p className="text-center text-xs text-muted-foreground">
                    Downgrade en contactant le support
                  </p>
                )}
              </div>

              {/* Pro Plan */}
              <div className="rounded-lg border-2 border-primary bg-card/30 p-8">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <span className="rounded bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    Recommandé
                  </span>
                </div>
                <p className="mb-6 text-3xl font-bold">
                  $39
                  <span className="text-sm text-muted-foreground">/mois</span>
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span>Générations illimitées</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span>Export PDF illimité</span>
                  </li>
                  <li className="flex gap-2 text-sm">
                    <span className="text-primary">✓</span>
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                {plan?.name === "Pro" ? (
                  <button
                    disabled
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
                  >
                    Plan actuel
                  </button>
                ) : (
                  <form action="/api/billing/checkout" method="POST">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Passer à Pro
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Billing FAQ */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Questions ?</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Les générations se réinitialisent le 1er de chaque mois (UTC).
              </p>
              <p>
                • Vous pouvez annuler votre abonnement à tout moment via le portail Stripe.
              </p>
              <p>
                • Pour toute question, contactez-nous à support@avproposal.ai
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
