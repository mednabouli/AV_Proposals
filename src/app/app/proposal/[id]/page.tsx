"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { generateProposal } from "@/app/actions/generate-proposal";
import type { GeneratedProposal } from "@/lib/ai/prompts";

export default function ProposalPage() {
  const params = useParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!proposalId) return;

    const generateContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateProposal({ proposalId });

        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }

        if (result.proposal?.generated_content) {
          setProposal(result.proposal.generated_content);
        }
        setLoading(false);
      } catch {
        setError("Erreur lors de la génération");
        setLoading(false);
      }
    };

    generateContent();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour
          </Link>
          <h1 className="text-lg font-semibold">Génération en cours...</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            </div>
            <p className="text-muted-foreground">Génération de votre proposition avec l&apos;IA...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour
          </Link>
          <h1 className="text-lg font-semibold">Erreur</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mb-4 inline-block rounded-lg bg-red-500/10 p-3">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400">{error}</p>
            <Link
              href="/app"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/50 px-6">
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour
          </Link>
          <h1 className="text-lg font-semibold">Erreur</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="text-muted-foreground">Dévis non trouvé</p>
        </div>
      </div>
    );
  }

  const totalPrice = proposal.pricing.subtotal * (1 + proposal.pricing.tax_rate);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            ← Retour
          </Link>
          <h1 className="text-lg font-semibold">{proposal.title}</h1>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => alert("Export PDF coming soon!")}
          >
            Exporter PDF
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Sections */}
          <div className="space-y-8">
            {proposal.sections.map((section, index) => (
              <section key={index} className="space-y-3">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Pricing Section */}
          <section className="mt-12 space-y-6 rounded-lg border border-border/50 bg-card/30 p-8">
            <h2 className="text-2xl font-semibold">Tarification</h2>

            {/* Breakdown */}
            <div className="space-y-2">
              {proposal.pricing.breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.item}</span>
                  <span className="font-medium">
                    ${item.cost.toLocaleString("fr-CA", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">
                  ${proposal.pricing.subtotal.toLocaleString("fr-CA", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Taxes ({(proposal.pricing.tax_rate * 100).toFixed(0)}%)
                </span>
                <span className="font-medium">
                  ${(proposal.pricing.subtotal * proposal.pricing.tax_rate).toLocaleString("fr-CA", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-2 text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  ${totalPrice.toLocaleString("fr-CA", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </section>

          {/* Assumptions & Exclusions */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {/* Assumptions */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">Assomptions</h3>
              <ul className="space-y-2">
                {proposal.assumptions.map((item, index) => (
                  <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Exclusions */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold">Exclusions</h3>
              <ul className="space-y-2">
                {proposal.exclusions.map((item, index) => (
                  <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 flex gap-3 border-t border-border/50 pt-8">
            <button
              className="flex-1 rounded-lg border border-border/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              onClick={() => alert("Regenerate coming soon!")}
            >
              Régénérer
            </button>
            <button
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              onClick={() => alert("Send to client coming soon!")}
            >
              Envoyer au client
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
