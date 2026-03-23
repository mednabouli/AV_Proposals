"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProposal } from "@/app/actions/proposals";

export default function NewProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    client_name: string;
    client_company: string;
    project_type: string;
    budget: string;
    location: string;
    date_duration: string;
    language: "fr" | "en";
    raw_brief: string;
  }>({
    client_name: "",
    client_company: "",
    project_type: "",
    budget: "",
    location: "Montréal",
    date_duration: "",
    language: "fr",
    raw_brief: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createProposal(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (!result.proposal) {
        setError("Erreur: pas de devis créé");
        setLoading(false);
        return;
      }

      // Redirect to view proposal (future: generate AI content)
      router.push(`/app/proposal/${result.proposal.id}`);
    } catch {
      setError("Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/30 md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
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
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            id="sidebar-new"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau devis
          </Link>
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            id="sidebar-history"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
          <h1 className="text-lg font-semibold">Nouveau devis</h1>
          <Link
            href="/app"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Retour
          </Link>
        </header>

        {/* Form */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Client Information Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Informations client
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="client_name" className="block text-sm font-medium">
                      Nom du client *
                    </label>
                    <input
                      id="client_name"
                      name="client_name"
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={handleChange}
                      placeholder="ex: Jean Dupont"
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="client_company" className="block text-sm font-medium">
                      Entreprise (optionnel)
                    </label>
                    <input
                      id="client_company"
                      name="client_company"
                      type="text"
                      value={formData.client_company}
                      onChange={handleChange}
                      placeholder="ex: ABC Productions"
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Informations projet
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="project_type" className="block text-sm font-medium">
                      Type de projet *
                    </label>
                    <select
                      id="project_type"
                      name="project_type"
                      required
                      value={formData.project_type}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="promotional_video">Vidéo promotionnelle</option>
                      <option value="product_demo">Démo produit</option>
                      <option value="event_coverage">Couverture événement</option>
                      <option value="corporate_video">Vidéo corporative</option>
                      <option value="animation">Animation</option>
                      <option value="live_streaming">Streaming en direct</option>
                      <option value="post_production">Post-production</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium">
                      Budget (CAD) *
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="ex: 2500 - 5000"
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium">
                      Localisation *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="ex: Montréal"
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="date_duration" className="block text-sm font-medium">
                      Date / Durée *
                    </label>
                    <input
                      id="date_duration"
                      name="date_duration"
                      type="text"
                      required
                      value={formData.date_duration}
                      onChange={handleChange}
                      placeholder="ex: 15-20 avril, 3 jours"
                      className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium">
                    Langue du devis
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Brief Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Brief client
                </h2>

                <div>
                  <label htmlFor="raw_brief" className="block text-sm font-medium">
                    Description du projet *
                  </label>
                  <textarea
                    id="raw_brief"
                    name="raw_brief"
                    required
                    rows={10}
                    value={formData.raw_brief}
                    onChange={handleChange}
                    placeholder="Colle ici le brief complet du client. Inclus les détails, objectifs, livrables, contraintes, etc."
                    className="mt-1 w-full rounded-lg border border-border/50 bg-card/50 px-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="flex gap-3 border-t border-border/50 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
                >
                  {loading ? "Création en cours..." : "Créer le devis"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
