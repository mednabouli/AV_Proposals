# AVProposal.ai — Metrics & Event Tracking (v0)

Objectif:
- Avoir un set minimal mais solide de métriques produit pour suivre
  activation, usage du “proposal generator” et conversion Free → Pro.
- Utiliser PostHog pour les events produit, et Stripe pour les métriques
  de revenu (MRR, churn).

---

## 1. Core KPIs (v0)

### Activation

**Activation Rate**
- Définition: % de nouveaux utilisateurs qui génèrent au moins 1 proposition
  dans les 7 jours suivant l'inscription.
- Formule:
  - activation_rate = (users_with_first_proposal <= J+7) / (new_signups) * 100

### Usage du core feature

**Proposals per Active User (PAU)**
- Définition: nombre moyen de propositions générées par utilisateur actif
  (7 ou 30 jours).
- Utilisation: détecter si les users reviennent vraiment pour le core job.

### Monétisation

**Free → Pro Conversion Rate**
- % des utilisateurs Free qui passent à Pro sur une période donnée (mois).

**Monthly Recurring Revenue (MRR)**
- Suivi via Stripe (pas besoin de le recalculer dans PostHog au début).

### Rétention (plus tard, mais à garder en tête)

**7/30-day Retention**
- % d’utilisateurs qui reviennent et génèrent une proposition au bout de 7 ou 30 jours.

---

## 2. PostHog Event Taxonomy

Convention de nommage:
- Events: `context:object_action` (ex: `auth:user_signed_up`).[web:139][web:142]
- Properties: `object_adjective` ou `is/has_*` pour les booléens.

### 2.1. Auth & Onboarding

1) `auth:user_signed_up`
   - Quand: après création de compte (Clerk + profil Supabase).
   - Properties:
     - `signup_source` (landing, invite, direct)
     - `user_type` (freelance, agency)
     - `default_language` (fr, en)
     - `default_currency` (cad, usd)

2) `onboarding:completed`
   - Quand: après la fin du mini-wizard (services, langues, tarifs).
   - Properties:
     - `services_selected` (array: event_capture, corporate_video, live_stream)
     - `has_portfolio` (bool, si demandé)
     - `is_agency` (bool)

### 2.2. Core feature — Proposal generator

3) `proposal:form_opened`
   - Quand: l’utilisateur arrive sur l’écran "Nouveau devis".
   - Properties:
     - `project_type_prefill` (si déjà connu)
     - `language_prefill` (fr, en)

4) `proposal:generated`
   - Quand: le backend a réussi à générer une proposition (LLM OK).
   - Properties:
     - `project_type` (event_capture, corporate_video, live_stream, other)
     - `language` (fr, en)
     - `budget_bucket` (low, mid, high)
     - `is_first_proposal` (bool)
     - `plan_tier` (free, pro)
     - `generation_time_ms` (si facile à calculer)
     - `has_custom_template` (bool)

5) `proposal:regenerated`
   - Quand: l’utilisateur regenère à partir de la même base (ajustements).
   - Properties:
     - `project_type`
     - `language`
     - `plan_tier`

6) `proposal:viewed_from_history`
   - Quand: un devis existant est ouvert depuis l’historique.
   - Properties:
     - `age_days` (nombre de jours depuis la création)
     - `plan_tier`

7) `proposal:exported`
   - Quand: l’utilisateur exporte (PDF ou copie).
   - Properties:
     - `export_type` (pdf, copy)
     - `language`
     - `plan_tier`

### 2.3. Billing & plans

8) `billing:paywall_shown`
   - Quand: l’utilisateur dépasse la limite du plan Free et voit le paywall.
   - Properties:
     - `plan_tier` (free)
     - `current_month_generations`
     - `limit_generations`

9) `billing:checkout_started`
   - Quand: on initie une session Stripe Checkout.
   - Properties:
     - `from_page` (pricing, paywall)
     - `target_plan` (pro)

10) `billing:plan_upgraded`
    - Quand: webhook Stripe confirmé, plan Pro actif.
    - Properties:
      - `previous_plan` (free)
      - `new_plan` (pro)

11) `billing:subscription_cancelled` (plus tard)
    - Quand: webhook de cancellation.
    - Properties:
      - `plan_tier`
      - `subscription_age_days`

---

## 3. Implementation Notes

### 3.1. Where to track

- Frontend (Next.js):
  - Auto‑capture de base (page views, clicks).
  - Custom events pour interactions UI:
    - `proposal:form_opened`
    - `proposal:exported`
    - `billing:paywall_shown`
    - `billing:checkout_started`

- Backend:
  - Événements critiques server‑side (plus fiables):
    - `auth:user_signed_up` (après création profil Supabase).
    - `onboarding:completed`.
    - `proposal:generated`.
    - `billing:plan_upgraded`.

### 3.2. Identity & properties

- `distinct_id`:
  - Utiliser l’ID Clerk ou l’ID profile Supabase (mais de façon cohérente).
- User properties (person properties):
  - `user_type` (freelance, agency)
  - `default_language`
  - `default_currency`
  - `plan_tier` (free, pro)
- Group properties (plus tard si agences multi‑users):
  - `organization_id`
  - `organization_size` (1, 2‑5, 6‑10, etc.)

---

## 4. Dashboards to create in PostHog (v0)

1) **Activation Funnel**
   - Steps:
     1. `auth:user_signed_up`
     2. `onboarding:completed`
     3. `proposal:generated` (is_first_proposal = true)
   - Segmentations:
     - `user_type`
     - `default_language`

2) **Core Usage**
   - Chart:
     - Daily/weekly count of `proposal:generated`.
   - Breakdown:
     - `plan_tier`
     - `project_type`

3) **Free → Pro Conversion**
   - Funnel:
     1. `billing:paywall_shown`
     2. `billing:checkout_started`
     3. `billing:plan_upgraded`
   - Calculer % de conversion et temps moyen entre paywall et upgrade.

4) **Retention (simple v0)**
   - Cohorte:
     - Users with `proposal:generated` (is_first_proposal = true).
   - Retention:
     - Users who triggered `proposal:generated` again 7/30 jours plus tard.

---

## 5. Data Hygiene & Privacy

- Ne JAMAIS envoyer:
  - Noms de clients finaux.
  - Texte brut du brief ou de la proposition.
- Toujours préférer des propriétés anonymisées / agrégées:
  - `budget_bucket` au lieu de montant exact.
  - `project_type` plutôt que titre du projet.
- Garder le nombre d’events raisonnable et suivre ce doc pour éviter le chaos.

---

## 6. Open questions

- Doit‑on suivre aussi:
  - Les abandons de formulaire (`proposal:form_abandoned`) ?
  - Les “regens” multiples comme signe d’insatisfaction ?
- Souhaite‑t‑on ajouter un petit NPS / sondage in‑app plus tard ?
