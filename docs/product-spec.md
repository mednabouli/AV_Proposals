# AVProposal.ai — Product Spec (v0)

## 1. Mission

AVProposal.ai aide les freelances vidéo et petites agences audiovisuelles de Montréal
à transformer un brief client (email, appel, RFP) en une proposition professionnelle
claire, bien tarifée et prête à envoyer en moins de 10 minutes, en français ou anglais,
en respectant les pratiques du marché québécois.

---

## 2. ICP (Ideal Customer Profile)

Primary ICP:
- Freelance vidéaste / réalisateur / monteur à Montréal ou au Québec.
- Petite agence AV (1–10 personnes) faisant:
  - Captation d’événements
  - Vidéo corporative
  - Live streaming / multi‑cam

Caractéristiques:
- Fait entre 3 et 30 devis/propositions par mois.
- Actuellement:
  - Perd du temps à copier/coller d’anciens documents Word/Google Docs.
  - N’a pas de modèle standardisé.
  - Oublie parfois des sections importantes (conditions, droits, timeline).

Secondary ICP (plus tard):
- Boîtes de production plus grandes avec plusieurs vendeurs / comptes.
- Boîtes hors Québec (Canada, US, Europe).

---

## 3. Core jobs-to-be-done

JTBD #1 — Générer un devis vidéo pro rapidement
- Quand je reçois un nouveau brief (mail, appel, RFP),
- Je veux générer une proposition claire, structurée et alignée avec mon pricing,
- Pour pouvoir l’envoyer dans la journée sans y passer 1–2 heures.

JTBD #2 — Garder une structure et une image pro cohérentes
- Quand j’envoie plusieurs devis par mois,
- Je veux que mes documents aient la même structure, ton et branding,
- Pour renforcer ma crédibilité et augmenter mon taux de closing.

JTBD #3 — Adapter facilement chaque proposition au contexte
- Quand un client a un contexte particulier (type d’événement, contrainte, budget),
- Je veux pouvoir ajuster sections, livrables et conditions en quelques clics,
- Pour être à la fois précis et rapide.

---

## 4. v0 Scope — Must-haves

v0 = “Solo freelancer tool” utilisable en prod, simple.

Must-haves:
1) Auth & profil
   - Connexion / inscription via Clerk.
   - Profil de base (nom, activité, langue par défaut, devise).
2) Création de proposition
   - Formulaire:
     - Infos client (nom, entreprise).
     - Type de projet (captation, vidéo corporative, live stream).
     - Budget indicatif.
     - Lieu (Montréal / autre).
     - Date / durée.
     - Langue (FR / EN).
     - Brief / RFP (texte libre).
   - Bouton “Générer la proposition”.
   - Génération via LLM:
     - Structure standard vidéo / AV:
       - Page de couverture / intro
       - Contexte & objectifs
       - Approche créative & technique
       - Scope de travail / livrables
       - Planning / timeline
       - Budget / options
       - Conditions générales (droits, révisions, paiements)
       - Prochaines étapes / call‑to‑action.
3) Historique & consultation
   - Liste de propositions déjà générées.
   - Affichage détaillé d’une proposition.
   - Possibilité de dupliquer un ancien devis et régénérer.
4) Export minimal
   - Copier/coller propre (formaté).
   - Export PDF simple (même style pour tout le monde).
5) Limites d’usage & plan
   - Plan Free avec X générations / mois.
   - Plan Pro avec plus de générations et PDF illimités.
   - Stripe pour gérer paiement et statut d’abonnement.
6) Rate limiting & sécurité
   - Rate limit par utilisateur (Upstash).
   - Auth obligatoire pour générer une proposition.

---

## 5. v0.5 / Nice-to-have (hors v0, pour plus tard)

- Support bilingue dans la même proposition (FR + EN).
- Templates personnalisés par type de service (vidéo corporative, événement, etc.)
  éditables dans l’interface.
- Ajout de portfolio / études de cas dans le document.
- Signature électronique intégrée.
- Collaboration multi‑utilisateurs (équipe).

---

## 6. Non-goals (v0)

Pour rester focus, v0 ne fera PAS:

- CRM complet (gestion leads, pipeline, relances, emails marketing).
- Gestion de projet complète (tâches, Gantt, budgets internes).
- Gestion avancée des fichiers (drive complet, rushes, etc.).
- Multi‑tenant complexe avec rôles avancés (admin, manager, etc.).
- Intégrations profondes (QuickBooks, Xero, HubSpot, etc.).

---

## 7. Main user flows (happy path)

Flow A — Nouveau freelance, premier devis
1) Arrive sur landing.
2) Clique sur “Commencer gratuitement”.
3) Crée un compte (Clerk).
4) Onboarding rapide:
   - Type de profil (freelance / agence).
   - Types de services principaux.
   - Langue par défaut.
   - Devise / lieu (Montréal, CAD).
5) Arrive sur dashboard “Créer ton premier devis”.
6) Remplit le formulaire (client, projet, budget, brief).
7) Clique sur “Générer”.
8) Voit la proposition générée, la relit, ajuste 1–2 sections.
9) Copie/colle ou exporte en PDF.
10) L’envoie à son client.

Flow B — Utilisateur régulier, upgrade Pro
1) Revient se connecter.
2) Dans l’historique, duplique une proposition précédente.
3) Change quelques paramètres (nouveau client, budget, date).
4) Génère une nouvelle version.
5) Atteint la limite de plan Free → prompt d’upgrade.
6) Va sur page pricing, choisit plan Pro.
7) Stripe Checkout → retour sur app, plan Pro actif.
8) Continue à générer sans friction.

---

## 8. Functional Requirements (résumé)

- Auth:
  - Login/Logout, gestion session via Clerk.
- Data:
  - Stockage des profils, propositions, templates, abonnements, usage.
- AI:
  - Appel LLM avec prompt structuré.
  - Contexte via templates (Pinecone) + input utilisateur.
- Billing:
  - Stripe Checkout + webhooks pour sync abonnements.
  - Limites par plan appliquées sur l’endpoint de génération.
- Emails:
  - Email de bienvenue à la fin de l’onboarding.
- Analytics:
  - Event: user_signed_up, first_proposal_generated, plan_upgraded.

---

## 9. Non-functional Requirements

- Langues:
  - Minimum: FR et EN supportés dans l’interface.
- Performance:
  - Génération typique < 10–20 secondes.
- Sécurité:
  - Données proposals uniquement visibles par leur propriétaire.
  - Pas de logging brut des briefs clients.
- Observabilité:
  - Sentry pour erreurs.
  - PostHog pour usage produit clé.

---

## 10. Billing & Plans (v0)

### Free Plan (Forever Free)
- **Price**: $0 CAD
- **Monthly generation limit**: 5 proposals/month
- **Features**:
  - Basic proposal generation
  - Copier/coller output
  - No PDF export
- **Target**: Solo freelancers testing the tool, low-volume users
- **Max monthly usage**: 5 proposals

### Pro Plan
- **Price**: $39 CAD/month (billed monthly)
- **Monthly generation limit**: Unlimited
- **Features**:
  - Unlimited proposal generation
  - PDF export (branded, professional)
  - Priority support (future)
  - Custom templates (future v0.5)
- **Target**: Active freelancers, small agencies with 10+ proposals/month
- **Stripe setup**:
  - Product ID: `prod_avproposal_pro`
  - Price ID: `price_avproposal_pro_monthly` (CAD)
  - Monthly recurring

### Usage tracking
- Generations counted per calendar month (UTC).
- Free plan: 5 soft limit (warning at 4/5, hard block at 5/5).
- Pro plan: No limit enforced.
- Rate limiting: 10 per hour per user (all plans, to prevent abuse).

### Upgrade flow
1. User on Free plan hits generation limit.
2. See: "You've reached 5 proposals this month. Upgrade to Pro for unlimited."
3. Button: "Go to Billing" → `/app/billing`
4. On `/app/billing`:
   - Current plan display
   - Pro plan card with "Upgrade now" button
   - Stripe Checkout link
5. After Stripe Checkout success → webhook updates DB, redirect to dashboard
6. Dashboard shows "Plan: Pro" badge.

### Stripe Integration
- Webhook endpoint: `POST /api/webhooks/stripe`
- Events to handle:
  - `checkout.session.completed` → Create/update `user_subscriptions`
  - `customer.subscription.updated` → Update subscription status
  - `customer.subscription.deleted` → Mark subscription as "canceled"

---

## 11. Décisions prises

| Question | Décision |
|---|---|
| Free plan | 5 générations/mois, pas d'export PDF |
| Pro plan | 39 $ CAD/mois, générations illimitées, PDF illimité |
| Branding | Palette à proposer (sombre/pro avec accent vibrant) |
| Ton de texte (v0) | 1 ton par défaut (professionnel). Choix de ton (corporate/casual/artistique) → v0.5 |
| Scope géographique (v0) | Montréal / Québec |
| UI framework | shadcn/ui + Tailwind CSS |

---

## 12. Status

✅ **Product spec approuvée** — prêt pour Stage 1 (Foundation).
