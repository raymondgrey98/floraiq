# FloraIQ

Nature identification app. Point camera at any plant, insect, bird, or mushroom — get an ID in seconds. Built on top of Gemini vision + GBIF data.

Web app + Android APK (Capacitor).

---

## Stack

React 19 / TypeScript / Vite / Tailwind v4 on the frontend. Express backend calling Gemini and OpenRouter. Leaflet maps with live GBIF occurrence data. Supabase for auth and chat history (optional). Capacitor wraps it into an Android APK.

## What's in it

- Camera-based species identification (plants, insects, birds, fungi, marine, reptiles)
- Plant disease detection via HuggingFace MobileNet (38 classes)
- Foraging map — edible/medicinal wild plants near you using GBIF
- Farm assistant with 13 tabs (irrigation, market prices, crop planning, etc.)
- Water tracker, plant journal, species map, wilderness survival guides
- AI chat (Gemini primary, OpenRouter fallback) with persistent session history
- 70+ tools across botany, zoology, farming, foraging

## Running it

```bash
pnpm install
pnpm dev
```

Needs a `.env` in the root:

```env
OPENROUTER_API_KEY=
GEMINI_API_KEY=
```

Supabase is optional — without it, chat history is ephemeral and auth is disabled:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Android

```bash
pnpm build
npx cap sync android
npx cap open android
```

## Structure

```text
client/src/
  pages/       all route views
  components/  WaveOrb, ScanOverlay, Chatbot, BottomNav
  context/     WorkstationContext

server/
  services/    gemini.service.ts, disease.service.ts
  routes.ts    all API endpoints

supabase/migrations/   DB schema (run once in Supabase SQL editor)
```

MIT
