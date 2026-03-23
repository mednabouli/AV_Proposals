# AVProposal.ai — Launch Checklist (v0 Beta)

Objectif:
- Vérifier que toute la chaîne (auth → génération → billing → analytics → domaine)
  fonctionne avant d’inviter les 2–3 premiers freelances en bêta.

Status convention:
- [ ] Not done
- [~] In progress
- [x] Done

---

## 1. Produit & UX

### 1.1. Parcours de base

[ ] Un nouvel utilisateur peut:
    - Arriver sur la landing.
    - Comprendre en 10 secondes ce que fait AVProposal.ai.
    - Cliquer sur “Commencer gratuitement”.

[ ] Parcours “happy path” complet (à tester en condition réelle):
    1. Sign up
    2. Onboarding
    3. Création d’un premier devis
    4. Export (copy/PDF)
    5. (Optionnel) Upgrade Pro

[ ] Textes FR/EN revus (pas de lorem ipsum, pas de fautes critiques).

---

## 2. Auth & Profils

[ ] Création de compte (Clerk) fonctionne en local et en prod.
[ ] Login/logout OK.
[ ] À la 1ère connexion, un `profile` Supabase est bien créé
    (vérifié dans la DB).
[ ] Onboarding minimal:
    - Type (freelance / agence)
    - Services principaux
    - Langue par défaut
    Les données sont bien stockées et réutilisées.

[ ] Routes protégées:
    - `/app` inaccessible sans être connecté.
    - Redirections correctes (non connecté → login).

---

## 3. Base de données & Modèle

[ ] Toutes les tables v0 existent dans Supabase:
    - profiles
    - proposal_templates
    - proposals
    - billing_plans
    - user_subscriptions
    - usage_logs

[ ] RLS/Policies:
    - Un utilisateur ne voit que ses propres `proposals`.
    - Un utilisateur ne voit que ses `templates` (sauf templates globales).

[ ] Test manuel:
    - Création d’un profil.
    - Insertion d’un `proposal` via l’app.
    - Lecture/affichage de ce `proposal` dans `/app`.

---

## 4. Core feature “Generate Proposal”

### 4.1. UI & Formulaire

[ ] Page “Nouveau devis” accessible depuis le dashboard.
[ ] Formulaire avec champs:
    - Client name / company
    - Project type
    - Budget
    - Location
    - Date / durée
    - Langue
    - Brief / RFP
[ ] Validation basique (champs obligatoires, formats acceptables).

### 4.2. Backend & AI

[ ] Endpoint / server action de génération:
    - Vérifie l’auth.
    - Vérifie le plan (free/pro) et l’usage.
    - Applique le rate limit (Upstash).
    - Appelle le LLM avec prompt structuré.
    - Sauvegarde `proposals` (raw_brief + generated_content).

[ ] Le résultat est bien structuré (JSON ou équivalent):
    - Sections (title + body).
    - Pricing / options.
    - Conditions / exclusions.

[ ] 2–3 générations réalistes testées avec de vrais briefs (copiés de mails RFP).

[ ] UX:
    - States: loading, success, error affichés correctement.
    - L’utilisateur comprend quoi faire si erreur.

---

## 5. Export & Historique

[ ] Page d’historique:
    - Liste des propositions (titre, client, date).
    - Clic sur une ligne → vue détaillée.

[ ] Export:
    - Bouton “Copier le texte” fonctionne.
    - Bouton “Export PDF” génère un PDF lisible.

[ ] Doublon:
    - Option “Dupliquer” un devis existant (crée un nouveau projet pré-rempli).

---

## 6. Billing & Stripe

[ ] Stripe:
    - Produits / prices créés (Free/Pro).
    - Webhooks configurés (endpoint en prod).

[ ] Checkout:
    - Depuis la page pricing, un user loggé peut:
      - Cliquer “Passer en Pro”.
      - Aller sur Stripe Checkout.
      - Revenir sur l’app une fois payé.

[ ] Webhooks:
    - Sur `checkout.session.completed`, `user_subscriptions` est mis à jour.
    - Plan, dates de période et statut corrects.

[ ] Limites:
    - Plan Free: limite de générations appliquée.
    - Quand limite atteinte:
      - L’utilisateur voit un paywall propre.
      - Event `billing:paywall_shown` envoyé à PostHog (si configuré).

---

## 7. Emails (Resend)

[ ] Resend configuré avec clé API en prod.

[ ] Email de bienvenue:
    - Envoi après onboarding complet.
    - Contenu avec:
      - Rappel du bénéfice.
      - Lien direct pour créer un premier devis.

[ ] (Optionnel v0) Autres emails:
    - Test d’un email “Your proposal is ready” (si on rajoute un jour de l’async).

---

## 8. Analytics (PostHog)

[ ] PostHog key + host configurés en prod.

[ ] Events minimum instrumentés:
    - `auth:user_signed_up`
    - `onboarding:completed`
    - `proposal:generated` (avec `is_first_proposal`)
    - `proposal:exported`
    - `billing:plan_upgraded`

[ ] Dashboards v0 créés:
    - Funnel Activation (signup → onboarding → first proposal).
    - Usage `proposal:generated` par jour, par plan.
    - Free → Pro funnel (paywall_shown → checkout_started → plan_upgraded).

[ ] Vérification:
    - On voit ses propres events en test réaliste (en utilisant la prod).

---

## 9. Erreurs & Logs (Sentry)

[ ] Sentry DSN configuré, env = `production`.

[ ] Test:
    - Une erreur volontaire côté client remonte dans Sentry.
    - Une erreur volontaire côté serveur remonte dans Sentry.
    - Les briefs/propositions ne sont PAS loggés en clair (vérifier).

[ ] Niveau de log:
    - Suffisant pour débugguer, mais sans données sensibles.

---

## 10. Domaine, SSL & Performance

[ ] Domaine acheté (Namecheap).

[ ] Cloudflare:
    - Domaine ajouté.
    - DNS configuré vers Vercel.
    - SSL actif (HTTPS OK).

[ ] Vercel:
    - Build prod OK.
    - Variables d’environnement bien ajoutées.

[ ] Test performance (simple):
    - Landing et dashboard se chargent en moins de ~2s sur connexion normale
      (test via un navigateur / devtools).

---

## 11. Beta readiness — Check final

[ ] Tu as testé toi-même le flow complet comme un freelance inconnu.

[ ] Tu as un mini pitch prêt pour les 2–3 premiers freelances:
    - Ce que ça fait.
    - Ce qui est encore “beta”.
    - Ce que tu attends comme feedback.

[ ] Tu as un canal pour recueillir le feedback:
    - Google Form, Notion, ou même un doc partagé.
    - Ou un simple “réponds à ce mail / WhatsApp”.

[ ] Tu as défini:
    - Combien de freelances tu invites en v0 (ex: 3).
    - Pendant combien de temps tu maintiens un onboarding “white glove”.

---

Quand cette checklist a >90% de cases cochées, tu peux lancer ta bêta privée,
en te focalisant sur l’observation du comportement réel et l’itération rapide
plutôt que sur l’ajout de features.
