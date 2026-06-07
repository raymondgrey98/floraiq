# FloraIQ

Point your camera at anything living — plant, insect, bird, mushroom — and know what it is in seconds. Built for the whole world, not just one country.

![hero](https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80)

---

## What it does

FloraIQ identifies species using AI vision, gives you care guides, disease diagnosis, a foraging map, and a full farm management toolkit. Think PictureThis but with more tools and no paywall.

Works on web and Android (via Capacitor).

---

## Features

- **Species ID** — plants, insects, birds, fungi, marine life, reptiles from a photo
- **Disease diagnosis** — detects 38 plant disease classes with treatment advice
- **Forage map** — finds edible and medicinal wild plants near your location
- **Farm assistant** — crop planning, pest control, market prices, irrigation, soil guides
- **Species map** — live sightings from GBIF on an interactive map
- **Water tracker** — watering schedules with overdue alerts
- **Plant journal** — track your garden over time
- **Wilderness toolkit** — edible, toxic, and medicinal plant guides for survival
- **70+ tools** — moon calendar, companion planting, bonsai, beekeeping, and more

---

## Stack

- **Frontend** — React 19, TypeScript, Vite 7, Tailwind CSS v4
- **UI** — Radix UI / shadcn, Framer Motion, Phosphor Icons, GSAP
- **Backend** — Express.js, Gemini API, OpenRouter
- **Maps** — Leaflet, GBIF, iNaturalist
- **Auth + DB** — Supabase (optional)
- **Mobile** — Capacitor v8 (Android APK)

---

## Running locally

```bash
pnpm install
pnpm dev
```

Frontend runs on `localhost:3000`, backend on `localhost:7171`.

**Required `.env`:**

```env
OPENROUTER_API_KEY=
GEMINI_API_KEY=
```

**Optional (for auth and persistent chat):**

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

---

## Android build

```bash
pnpm build
npx cap sync android
npx cap open android
```

---

## Project layout

```text
client/src/
  pages/       50+ route components
  components/  WaveOrb, ScanOverlay, Chatbot, BottomNav, etc.
  context/     WorkstationContext (auth + scan state)

server/
  routes.ts         API endpoints
  services/
    gemini.service.ts   Gemini chat + vision
    disease.service.ts  HuggingFace plant disease

supabase/
  migrations/   SQL schema for chat sessions + observations
```

---

## License

MIT
