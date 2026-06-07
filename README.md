# FloraIQ

Nature intelligence platform — identify any organism, anywhere, instantly.

Point your camera at a plant, bird, insect, fungus, or marine species and get a full breakdown: scientific name, care guide, toxicity, habitat, and more. Runs on web, Android, and Windows desktop.

---

## Features

- **Species ID** — plants, birds, insects, fungi, marine life, reptiles from a single photo
- **Plant Disease Diagnosis** — detect 38+ disease classes from leaf images
- **Forage Map** — edible and medicinal plants near your location via GBIF
- **Farm Assistant** — irrigation, soil, pest control, harvest planning, market prices
- **Species Map** — live biodiversity map with real GBIF observations
- **Survival Toolkit** — wilderness guides, edible/toxic plant identification
- **Landscape Intelligence** — terrain and environment analysis
- **Water Tracker** — plant watering schedules with overdue alerts
- **Plant Journal** — log discoveries, export as CSV
- **AI Chat** — expert botany, zoology, and ecology assistant
- **70+ tools** across all nature intelligence categories
- **25+ languages** supported
- **Works globally** — every country, every climate, every species

---

## Platforms

| Platform | How |
|---|---|
| Web | `pnpm dev` → localhost |
| Android | APK via Capacitor |
| Windows | Installer via Electron |

---

## Setup

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and fill in your keys.

---

## Build

```bash
# Web
pnpm build

# Windows desktop installer
pnpm electron:build

# Android APK
pnpm cap:apk
```

---

## Database

Run `supabase/migrations/001_floraiq_schema.sql` in your Supabase SQL editor before using auth or chat features.

---

## Tech Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · Express · Leaflet · Supabase · Capacitor · Electron

---

## License

MIT © raymondgrey98
