# FloraIQ → Enterprise Software Blueprint
### + a ready-to-paste brief for **Claude Design**

This document does two jobs:
1. **Hand FloraIQ to Claude Design** so it can produce on-brand, premium UI mockups.
2. **A roadmap** to evolve FloraIQ from an app into an enterprise software platform.

Repo: `github.com/raymondgrey98/floraiq` · Codebase root: `C:\Users\USER\Desktop\FloraIQ`

---

## 1. What FloraIQ is (one paragraph for Claude Design)

FloraIQ is a **global nature-intelligence platform**: point your phone at any plant, insect,
bird, or fungus → instant AI identification → rich species profile with care, toxicity, and
related species → save to a personal garden with care reminders → contribute sightings to a
world map. Web app + Android app (BioScan) from **one React codebase**. Premium, scientific,
dark aesthetic with emerald accents. Competes with **PictureThis** (identification polish) and
**iNaturalist** (scientific depth + community).

---

## 2. Design system (paste this into Claude Design)

**Brand feel:** premium, trustworthy, scientific — not childish. Dark-first. Glassmorphism.
Generous spacing, smooth micro-interactions.

**Color tokens**
| Token | Value | Use |
|---|---|---|
| Background | `#0a0a0a` / `#07100c` | app base |
| Surface (glass) | `rgba(255,255,255,0.04)` + blur | cards |
| Primary (emerald) | `#10b981` | actions, accents |
| Primary light | `#34d399` / `#4ade80` | highlights, text glow |
| Primary deep | `#059669` | gradients |
| Text | `rgba(255,255,255,0.9)` | headings |
| Muted text | `rgba(255,255,255,0.45)` | secondary |
| Risk: safe / caution / danger | `#4ade80` / `#fbbf24` / `#f87171` | toxicity badges |

**Type:** Inter / SF Pro style. Headings 800–900 weight, tight tracking. Body 400–600.

**Components to design (mockups I can then build in code):**
- Species detail page — full-bleed hero photo, floating ID card w/ confidence ring, care cards,
  **similar species** strip, toxicity banner, taxonomy tree, source links.
- Camera / observation flow — Instagram-Stories-style capture, mode selector, reticle.
- Home — time-aware "living" hero (already built), feature grid, My Garden strip.
- Onboarding — 3–4 premium slides.
- Profile — stats, badges, "Research Grade" achievements.
- Bottom nav — floating center scan button.

**How to use Claude Design:** New Prototype → attach screenshots of PictureThis + iNaturalist +
a FloraIQ screenshot as references (the `+` button in the composer) → describe the screen →
export the result → drop that image into Claude Code and I build it pixel-accurate in React.

---

## 3. Current architecture (facts)

- **Frontend:** React 19 + TypeScript + Vite + Tailwind v4, wouter routing, framer-motion, cmdk.
- **Backend:** Express (port 7171), services decoupled: `gemini.service`, `disease.service`.
- **AI identify:** OpenRouter vision (`/api/identify`) + iNaturalist CV fallback + GBIF taxonomy.
- **AI chat:** Gemini 2.5 with server session memory + client fallback.
- **Data (free, no key):** iNaturalist, GBIF, Wikipedia, Open-Meteo, OpenFarm, Leaflet/OSM.
- **Mobile:** Capacitor (Android built; iOS via `codemagic.yaml`), native camera + notifications.
- **Auth/DB (optional):** Supabase (Postgres) — currently soft-wired.
- **Registry:** `client/src/lib/tools.tsx` — single source of truth for all 100+ tools.
- **Premium UX shipped:** ⌘K Spotlight, living hero, Add-to-Garden + reminders, Similar species.

---

## 4. App → Enterprise: the roadmap

### Phase A — Foundation (make it a product)
- **Accounts & sync:** finish Supabase auth (email + OAuth); move garden/journal/scans to
  Postgres so they sync across devices; Row-Level Security per user.
- **Observation data model (PostGIS):** `observations(user, taxon, lat/lng, photos, grade)`,
  `taxa`, `identifications(votes)` → enables the map, community ID, and "Research Grade".
- **AI reliability:** primary vision model + fast fallback + on-device TFLite for offline/instant;
  cache identifications; per-request timeouts (done in scan flow).

### Phase B — Platform (defensible moat)
- **Community & verification:** iNaturalist-style voting → Research Grade → feeds a species graph.
- **Species graph:** ecological relationships (pollinator/host/companion) in Postgres, Neo4j later.
- **Offline-first + sync queue:** local cache, background sync, PWA + Capacitor.
- **Observability:** logging, error tracking (Sentry), rate limiting, API keys per client.

### Phase C — Enterprise / revenue
- **Freemium:** free scans/day; Pro = unlimited + care plans + disease + offline packs.
- **B2B / API:** license the identify + species API to agri-tech, education, eco-tourism, gov
  biodiversity programs. Usage-metered keys, dashboards, SLAs.
- **Team/org tenancy:** orgs, roles, shared projects & collections (schools, farms, NGOs, parks).
- **White-label:** themeable brand kit so partners ship their own nature app on FloraIQ.
- **Compliance & scale:** GDPR/PDPA, data residency, i18n (25+ languages), audit logs, CI/CD,
  autoscaling (Vercel/edge + managed Postgres), test coverage, staged releases (EAS/Codemagic).

### Monetization summary
Consumer freemium (Pro subscription) · B2B species/ID API (metered) · Org licenses
(education/agri/gov) · White-label partnerships · Anonymized biodiversity data insights.

---

## 5. Prompt to hand another Claude (or Claude Design)

> You are the lead architect for FloraIQ, a global nature-intelligence platform (React 19 + Vite +
> TS frontend, Express backend, Capacitor mobile, Supabase/Postgres, free biodiversity APIs). Goal:
> evolve it from an app into an enterprise SaaS with accounts, sync, community verification
> (Research Grade), a species graph, a metered identification API, org tenancy, and freemium +
> B2B monetization — without breaking the premium PictureThis/iNaturalist-grade UX. Ship minimal,
> verifiable deltas. Design new screens in the FloraIQ design system above; I implement them in code.
