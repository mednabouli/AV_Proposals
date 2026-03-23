import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Tarifs — AVProposal.ai",
  description:
    "Plan Free et Pro pour générer vos propositions AV. Commencez gratuitement.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Pour essayer l'outil et générer vos premiers devis.",
    features: [
      "5 générations / mois",
      "Historique complet",
      "Français & Anglais",
      "Copier / coller formaté",
    ],
    limitations: ["Pas d'export PDF"],
    cta: "Commencer gratuitement",
    ctaVariant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "39",
    description: "Pour les freelances actifs et petites agences.",
    features: [
      "Générations illimitées",
      "Export PDF illimité",
      "Historique complet",
      "Français & Anglais",
      "Templates personnalisés",
      "Support prioritaire",
    ],
    limitations: [],
    cta: "Passer au Pro",
    ctaVariant: "primary" as const,
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/6 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Tarifs simples,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  sans surprise
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Commencez gratuitement. Passez au Pro quand vous en avez besoin.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                    plan.popular
                      ? "border-primary/40 bg-card shadow-xl shadow-primary/10"
                      : "border-border/50 bg-card/50"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Populaire
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price} $</span>
                      <span className="text-sm text-muted-foreground">
                        CAD / mois
                      </span>
                    </div>
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                    {plan.limitations.map((lim) => (
                      <li
                        key={lim}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        {lim}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/app"
                    className={`mt-8 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl"
                        : "border border-border bg-secondary text-secondary-foreground hover:border-primary/30 hover:bg-secondary/80"
                    }`}
                    id={`pricing-cta-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
