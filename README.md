# FloraIQ

Point your camera at anything in nature and get an instant, detailed breakdown. Plants, birds, insects, fungi, marine life, reptiles — FloraIQ identifies them all and goes far beyond a basic lookup.

Built for the whole world. Every country, every climate, every species.

---

## What it does

**Scan & Identify**  
Upload a photo or use your live camera. The app sends the image to a vision AI that returns the scientific name, common names, confidence score, habitat, toxicity warning, and care instructions. Results pull from iNaturalist CV, GBIF, Wikipedia, and OpenFarm to give you layered, sourced data — not just a name.

**Species Map**  
A live Leaflet map pulls real occurrence data from GBIF. Filter by Plants, Birds, Insects, Fungi, Reptiles, Marine, or Mammals. Search by any name — results come from all continents, not just one region. Click any dot for observation details, GBIF link, iNaturalist link, and Wikipedia.

**Plant Disease Diagnosis**  
Upload a leaf photo. A HuggingFace MobileNet model (trained on 38 disease classes) classifies the disease, then Gemini generates a plain-language treatment plan with organic and chemical options.

**Farm Assistant**  
13 tabs covering irrigation scheduling, soil pH, pest identification, hydroponics, companion planting, harvest timing, market prices, and more. Pulls live weather from Open-Meteo. Works in 25 languages.

**Forage Map**  
Uses GBIF occurrence data to show edible and medicinal wild plants near any location. Each species links to an OpenFarm care guide with foraging notes.

**Survival Toolkit**  
Emergency plant ID (edible vs toxic), first aid using local plants, water sourcing, shelter guides. Designed for use offline if needed.

**Landscape Intelligence**  
Terrain analysis using geolocation — elevation, biome type, weather patterns, satellite context.

**Water Tracker**  
Add your plants, set watering intervals, get overdue alerts. Persists in local storage so it works without an account.

**Plant Journal**  
Log every scan. Grid or list view. Filter by date, category, or species. Export as CSV. Links to Wikipedia and iNaturalist for each entry.

**AI Chat**  
Ask anything about plants, animals, farming, or wilderness survival. Calls the backend first; falls back to Gemini directly if the server is offline so it always works.

---

## Architecture

```
client/          React 19 + TypeScript frontend (Vite 7)
  src/
    pages/       One file per feature (70+ pages)
    components/  Shared UI (Chatbot, BottomNav, ScanOverlay, etc.)
    contexts/    Theme, Workstation state
    hooks/       Custom hooks (sound effects, geolocation, etc.)
    lib/         Utility functions

server/          Express backend
  index.ts       Server entry, mounts routes
  routes.ts      All API endpoints

shared/          Types shared between client and server

android/         Capacitor Android project (auto-generated, do not edit manually)
electron/        Electron desktop wrapper
assets/logo/     Brand assets — icon, wordmark, ICO
```

### How a scan works

1. User picks an image (upload or live camera capture)
2. Frontend sends `POST /api/identify` with the image as form data
3. Backend resizes and encodes the image, builds a structured prompt
4. OpenRouter routes to `nvidia/nemotron-nano-12b-v2-vl:free` (vision model)
5. If that fails, falls back to `google/gemma-4-31b-it:free`
6. Backend simultaneously calls GBIF to enrich with taxonomy and occurrence count
7. Response includes: scientific name, common names, confidence, toxicity, care tips, habitat, GBIF key
8. Frontend renders the result card with Wikipedia extract, 12 external source links, and a map pin option

### How the map works

1. On load, fetches 300 occurrences from `https://api.gbif.org/v1/occurrence/search`
2. Random offset per request so results cycle through all regions globally
3. Filter params map to GBIF kingdom/class keys (Plants = kingdom 6, Birds = class Aves, etc.)
4. Text search uses the `q` param which matches vernacular name, scientific name, and location
5. Markers drawn with Leaflet, coloured by category
6. Clicking a marker shows a panel with observation details and external links

### How the chatbot works

1. Tries `POST /api/chat` on the Express backend (6-second timeout)
2. If backend is offline or times out, calls Gemini 2.0 Flash directly from the browser
3. Maintains full conversation history for multi-turn context
4. System prompt anchors it to nature, botany, zoology, farming, and survival topics

---

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment file and fill in your keys
cp .env.example .env
```

Required keys in `.env`:

```
OPENROUTER_API_KEY=     # get from openrouter.ai — free tier available
GEMINI_API_KEY=         # get from aistudio.google.com — free
VITE_GEMINI_API_KEY=    # same key as above, needed for frontend fallback
SUPABASE_URL=           # optional — only for auth and chat history
SUPABASE_SECRET_KEY=    # optional
VITE_SUPABASE_URL=      # optional
VITE_SUPABASE_PUBLISHABLE_KEY=  # optional
```

The app works without Supabase. Auth and chat history will be disabled but all other features run fine.

---

## Running locally

```bash
# Start both frontend and backend together
pnpm dev

# Frontend only (map, chatbot fallback, journal, water tracker still work)
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:7171`

---

## Building

```bash
# Web build (output: dist/public/)
pnpm build

# Windows desktop installer (output: dist-electron/)
pnpm electron:build

# Android APK (requires Android SDK)
pnpm cap:apk
```

For the Android build, set `ANDROID_SDK_ROOT` to your SDK path before running.

---

## Database

If you're using Supabase, run `supabase/migrations/001_floraiq_schema.sql` in the SQL editor before using login, signup, or persistent chat history.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| UI components | Radix UI (shadcn pattern), Framer Motion, Lucide |
| Maps | Leaflet, react-leaflet |
| Charts | Recharts |
| Backend | Express 4, tsx |
| AI — vision scan | OpenRouter (Nemotron Vision / Gemma fallback) |
| AI — chat | Gemini 2.0 Flash |
| AI — disease | HuggingFace MobileNet (plant disease, 38 classes) |
| Species data | GBIF, iNaturalist CV, OpenFarm, Wikipedia REST |
| Weather | Open-Meteo (no key required) |
| Auth + storage | Supabase (optional) |
| Mobile | Capacitor v8 |
| Desktop | Electron 42, electron-builder |

---

## External APIs used

All free or free-tier. No paid API is required to run the app.

| API | Used for | Key required |
|---|---|---|
| OpenRouter | Plant/organism identification (vision) | Yes — free tier |
| Gemini | AI chat, disease treatment advice | Yes — free |
| GBIF | Species occurrence data, taxonomy | No |
| iNaturalist CV | Secondary species identification | No |
| OpenFarm | Plant care guides | No |
| Wikipedia REST | Species descriptions | No |
| Open-Meteo | Weather for farm assistant | No |
| HuggingFace | Disease classification model | No (public model) |

---

## License

MIT © raymondgrey98
