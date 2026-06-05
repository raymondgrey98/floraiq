# 🌿 FloraIQ — Nature Intelligence Platform

> **Identify any living thing in 3 seconds. 400,000+ species. 196 countries. Free forever.**

![FloraIQ Hero](https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80)

---

## What is FloraIQ?

FloraIQ is a **global nature intelligence platform** combining AI-powered species identification, plant care, farm management, foraging tools, and biodiversity mapping — all in one app. Designed for every country, every climate, every species.

---

## Features

### Core
| Feature | Status |
|---|---|
| Camera scan → instant AI plant/organism ID | ✅ Live |
| 400K+ species database (GBIF + iNaturalist) | ✅ Live |
| Plant disease diagnosis — 38 disease classes | ✅ Live |
| Personalised care plans via OpenFarm | ✅ Live |
| Toxic/dangerous plant warnings | ✅ Live |
| Water tracker with smart reminders | ✅ Live |
| Species library and plant collection | ✅ Live |
| Expert AI chat — botany, zoology, ecology | ✅ Live |
| Plant journal and my garden | ✅ Live |

### FloraIQ Exclusive
| Feature | Status |
|---|---|
| Wilderness toolkit — edible, medicinal, toxic plants | ✅ Live |
| Landscape intelligence — satellite and terrain view | ✅ Live |
| Farm assistant — 13-tab AI toolkit for farmers | ✅ Live |
| BioScan geolocation species mapping | ✅ Live |
| Forage map — wild edible and medicinal plants near you | ✅ Live |
| 25+ language support | ✅ Live |
| 70+ free data source integrations | ✅ Live |
| Android APK via Capacitor | ✅ Built |

---

## Tech Stack

```
Frontend:   React 19 + TypeScript + Vite 7 + Tailwind CSS v4
UI:         Radix UI (shadcn/ui) · Framer Motion · Phosphor Icons
Backend:    Express.js · OpenRouter AI API
Maps:       Leaflet + react-leaflet + GBIF live data
Animations: Framer Motion · Canvas WaveOrb · Lottie · GSAP-ready · Floating SVG particles
Mobile:     Capacitor v8 (Android)
```

---

## Animation Stack

FloraIQ uses layered premium animations — no emoji, no placeholders:

| Animation | Component | Description |
|---|---|---|
| Aurora hero orbs | `Home.tsx` | 3 floating CSS gradient blobs in the hero |
| Dancing leaf particles | `Home.tsx` | 18 SVG leaves rising and drifting in the wind |
| Shimmer headline | `Home.tsx` | Gradient text sweep on the hero title |
| Pulsing scan button | `Home.tsx` | Glow pulse + shimmer sweep on CTA |
| Wave Orb | `WaveOrb.tsx` | 3D particle sphere — 380 Fibonacci-distributed particles, wave distortion |
| Loading overlay | `LoadingScreen.tsx` | Full-screen orb + animated progress bar sweep |
| AI thinking orb | `Chatbot.tsx` | WaveOrb appears when AI is processing |
| Framer Motion | Everywhere | Staggered entrances, hover lift, tap scale, slide transitions |
| Lottie-ready | — | `lottie-react` installed — drop in any `.json` from LottieFiles |
| GSAP-ready | — | Add `pnpm add gsap` to unlock MorphSVG, ScrollTrigger, DrawSVG |

---

## Pages

| Route | Page | Status |
|---|---|---|
| `/` | Home | ✅ Redesigned |
| `/scan` | Identify Organism | ✅ Live |
| `/scan-results` | Scan Results | ✅ Live |
| `/disease` | Disease Diagnosis | ✅ Live |
| `/farm` | Farm Assistant | ✅ Live |
| `/forage` | Forage Map | ✅ Live |
| `/survival` | Wilderness Toolkit | ✅ Live |
| `/map` | Species Map | ✅ Live |
| `/water` | Water Tracker | ✅ Live |
| `/journal` | Plant Journal | ✅ Live |
| `/tools` | Tools Hub (70 tools) | ✅ Live |
| + 40 more | Guides, calculators, ID tools | ✅ Live |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# → Frontend: http://localhost:3000
# → Backend:  http://localhost:7171
```

### Environment Variables

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

---

## Project Structure

```
floraiq-extract/
├── client/
│   └── src/
│       ├── pages/           # 50+ page components
│       ├── components/
│       │   ├── WaveOrb.tsx       # 3D canvas particle sphere
│       │   ├── LoadingScreen.tsx # Loading overlay with orb
│       │   ├── Chatbot.tsx       # AI chat with thinking animation
│       │   ├── BottomNav.tsx     # Mobile bottom navigation
│       │   └── ui/               # shadcn/ui base components
│       └── App.tsx
├── server/
│   ├── index.ts             # Express server
│   └── routes.ts            # API routes
└── android/                 # Capacitor Android project
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/identify` | AI species ID from image |
| POST | `/api/identify/inat` | iNaturalist Computer Vision |
| POST | `/api/chat` | AI nature assistant |
| POST | `/api/disease` | Plant disease diagnosis |
| GET | `/api/species/:name` | Species detail |
| GET | `/api/species/forage` | Edible plants from GBIF |
| POST | `/api/bioscan/sync` | Geolocation + species record |

---

## Build for Android

```bash
pnpm build
npx cap sync android
npx cap open android
```

---

## Contributing

Pull requests welcome. Open an issue first for major changes.

---

## License

MIT © [raymondgrey98](https://github.com/raymondgrey98)
