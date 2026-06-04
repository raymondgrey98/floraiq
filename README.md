# 🌿 FloraIQ — Nature Intelligence Platform

> **The #1 nature intelligence app built for the whole world.**  
> Identify any living thing in 3 seconds. 400,000+ species. 196 countries. Free forever.

![FloraIQ](https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80)

---

## What is FloraIQ?

FloraIQ is a **global nature intelligence platform** that combines AI-powered species identification, plant care, farm management, survival tools, and biodiversity mapping — all in one app. Built in Sarawak, Malaysia. Designed for 196 countries.

**Reference app:** PictureThis — FloraIQ matches it on every feature and goes far beyond.

---

## Features

### Core (PictureThis parity)
| Feature | Status |
|---|---|
| Camera scan → instant AI plant/organism ID | ✅ Live |
| 400K+ species database via GBIF + iNaturalist | ✅ Live |
| Plant disease diagnosis (38 disease classes) | ✅ Live |
| Personalised care plans via OpenFarm | ✅ Live |
| Toxic/dangerous plant warnings | ✅ Live |
| Water tracker with reminders | ✅ Live |
| Species library / plant collection | ✅ Live |
| Expert AI chat (botany, zoology, ecology) | ✅ Live |
| Plant journal / my garden | ✅ Live |

### FloraIQ Exclusive
| Feature | Status |
|---|---|
| Survival toolkit (edible, medicinal, toxic) | ✅ Live |
| Landscape OSINT (satellite + terrain) | ✅ Live |
| Farm assistant (13 tabs, crop planning, pest, finance) | ✅ Live |
| BioScan geolocation species mapping | ✅ Live |
| Forage map (wild edible + medicinal plants) | ✅ Live |
| 25+ language support | ✅ Live |
| 70+ free data source integrations | ✅ Live |
| Android APK (BioScan) via Capacitor | ✅ Built |

---

## Tech Stack

```
Frontend:   React 19 + TypeScript + Vite 7 + Tailwind CSS v4
UI:         Radix UI (shadcn/ui style) · Framer Motion · Phosphor Icons
Backend:    Express.js (port 7171) · proxied via Vite
AI:         OpenRouter API (nvidia/nemotron vision + gemma fallback)
Maps:       Leaflet + react-leaflet + GBIF live data
Animations: Framer Motion · Custom canvas WaveOrb · Lottie · Floating SVG particles
Mobile:     Capacitor v8 (Android APK)
```

---

## Pages (50+ routes)

| Route | Page | Status |
|---|---|---|
| `/` | Home | ✅ Redesigned |
| `/scan` | Identify Organism | ✅ Live |
| `/scan-results` | Scan Results | ✅ Live |
| `/disease` | Disease Diagnosis | ✅ Live |
| `/farm` | Farm Assistant | ✅ Live |
| `/forage` | Forage Map | ✅ Live |
| `/survival` | Survival Toolkit | ✅ Live |
| `/map` | Species Map | ✅ Live |
| `/water` | Water Tracker | ✅ Live |
| `/journal` | Plant Journal | ✅ Live |
| `/tools` | Tools Hub (70 tools) | ✅ Live |
| + 45 more | Various guides & tools | ✅ Live |

---

## Animations

FloraIQ uses premium animations throughout:

- **Floating leaf particles** — 18 SVG leaves drift upward in the hero (pure CSS keyframes)
- **Aurora orbs** — 3 animated gradient blobs behind the hero (CSS animation)
- **WaveOrb** (`components/WaveOrb.tsx`) — 3D particle sphere like Echo Mind, pure canvas, zero deps
- **LoadingScreen** (`components/LoadingScreen.tsx`) — Full-screen overlay with WaveOrb + progress bar
- **Framer Motion** — All page transitions, staggered entrances, hover/tap effects
- **Lottie-ready** — `lottie-react` installed, drop in any `.json` from [LottieFiles](https://lottiefiles.com)

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (frontend + backend)
pnpm dev

# Frontend: http://localhost:3000 (or 3001 if port in use)
# Backend:  http://localhost:7171
```

### Environment Variables

Create `.env` in the project root:

```env
OPENROUTER_API_KEY=sk-or-v1-...
GEMINI_API_KEY=AIzaSy...
```

---

## Project Structure

```
floraiq-extract/
├── client/
│   ├── src/
│   │   ├── pages/          # 50+ page components
│   │   ├── components/
│   │   │   ├── WaveOrb.tsx       # 3D particle sphere animation
│   │   │   ├── LoadingScreen.tsx # Full-screen loading overlay
│   │   │   ├── Chatbot.tsx       # AI chat with WaveOrb
│   │   │   ├── BottomNav.tsx     # Mobile bottom navigation
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── App.tsx
│   └── index.html
├── server/
│   ├── index.ts            # Express server (port 7171)
│   └── routes.ts           # All API routes
├── shared/
├── android/                # Capacitor Android project
└── package.json
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/identify` | AI plant/organism ID from image |
| POST | `/api/identify/inat` | iNaturalist Computer Vision |
| POST | `/api/chat` | AI chatbot (OpenRouter) |
| POST | `/api/disease` | Plant disease diagnosis |
| GET | `/api/species/:name` | Species detail lookup |
| GET | `/api/species/forage` | Edible plants from GBIF |
| POST | `/api/bioscan/sync` | Geolocation + species record |

---

## Android APK

APK built with Capacitor v8:

```bash
pnpm build
npx cap sync android
npx cap open android   # Opens Android Studio
```

Built APK location: `C:\Users\USER\Desktop\FloraIQ.apk`

---

## Owner

**USER** — Kuching, Sarawak, Malaysia  
GitHub: [github.com/raymondgrey98](https://github.com/raymondgrey98)

**Mission:** Build FloraIQ into the #1 nature intelligence app globally — beating PictureThis worldwide.

---

## License

MIT © USER — All rights reserved.
