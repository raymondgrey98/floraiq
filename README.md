# FloraIQ — Nature Intelligence Platform

Point your camera at anything in nature and get an instant, detailed breakdown. Plants, birds, insects, fungi, marine life, reptiles — FloraIQ identifies them all and goes far beyond a basic name lookup.

**90 tools. All live. Built for 196 countries.**

---

## Download

| Platform | File | Version |
| --- | --- | --- |
| Android APK | [FloraIQ-signed.apk](https://github.com/raymondgrey98/floraiq/releases/tag/v1.0.0) | v1.0.0 signed |
| Windows | Clone repo → `pnpm electron:build` | v1.0.0 |
| Web | `pnpm dev` → localhost:3000 | latest |

---

## Features

### Scan & Identify
Upload a photo or open the native camera. The image goes to a vision AI that returns scientific name, common names in 25 languages, confidence score, toxicity level, habitat description, and full care instructions. Results are enriched from iNaturalist CV, GBIF, Wikipedia, and OpenFarm in a single response.

Seven scan modes: Plant / Herb, Insect / Bug, Bird, Mushroom / Fungi, Reptile / Amphibian, Marine Life, Survival Scan.

On Android the native system camera opens — no WebView permission issues. On desktop/web, live camera streaming with frame capture works via the browser.

### Sound ID
Record 1–10 seconds of any wildlife sound. Gemini AI identifies the bird, insect, frog, or other animal — returns species name, confidence, habitat, sound description, and links to Xeno-canto (listen to the real call) and Wikipedia.

### Plant Disease Diagnosis
Upload a leaf photo. A HuggingFace MobileNet model (38 disease classes) classifies the disease. Gemini then generates a plain-language treatment plan with organic and chemical options.

### Species Map
Live Leaflet map pulling real occurrence data from GBIF (1 billion+ records). Filter by Plants, Birds, Insects, Fungi, Reptiles, Marine, or Mammals. Search any species by name — results come from all continents using random offset pagination. Click any dot for observation details and links.

### Farm Assistant
13 tabs: crop planner, pest identifier, irrigation calculator, soil pH guide, companion planting, harvest timer, market prices, hydroponics, composting, moon calendar, UV tracker, rainfall planner, weather forecast. Pulls live weather from Open-Meteo. Works in 25 languages.

### Agri Store Finder
Full-screen GPS map that finds the nearest agriculture supply shops within any radius (1–100 km). Features:
- Text search any city or area via Nominatim geocoding
- Tap anywhere on the map to search stores at that point
- Three map tiles: Street, Satellite (Esri), Terrain
- 9 store categories with coloured markers: Seeds, Fertilizer, Nursery, Hardware, Vet/Feed, Market, Equipment, Irrigation, General
- Save favourite stores (gold marker border)
- Proximity alerts via push notification when you walk within 500m of a saved store
- One-tap Waze and Google Maps directions
- Quick Waze category searches: Seeds, Nursery, Hardware, Animal Feed, Irrigation, Equipment, Market
- Share any store location via Web Share / clipboard

### Water Tracker
Add plants, set watering intervals, get overdue alerts. Bell toggle enables push notifications: the app schedules a reminder at 8 AM on each plant's due date via the local notification system. Watering or deleting a plant automatically reschedules or cancels the notification.

### Forage Map
GBIF occurrence data filtered to edible and medicinal wild plants near any location. Each species links to an OpenFarm care guide with foraging notes.

### AI Chat
Full conversational AI anchored to nature, botany, zoology, farming, and wilderness survival. Tries the Express backend first, falls back to Gemini 2.0 Flash directly from the browser if the server is offline — always works.

### Smart Guide (90 AI-Powered Tools)
Every tool in the hub is live. Tools without dedicated pages (Orchid Care, Hydroponics, Tree Grafting, Agroforestry, Dragonfly Guide, Hornbill Spotter, Mangrove Ecosystem, Indigenous Plant Wisdom, Bamboo Guide, Natural Dyes, and more) open a Smart Guide page that:
- Loads a two-paragraph AI expert introduction on open
- Shows four quick-tap topic questions
- Provides a full chat interface for any follow-up question
- Links to Wikipedia, GBIF, and YouTube for deeper reading

### More Tools
Water Purification, Survival Plants, Nature Navigation, Animal Tracks, Nocturnal Animals, Foraging Calendar, Jungle Medicine, Plant First Aid, Shelter Building, Landscape Intelligence, Moon Calendar, UV Tracker, Rainfall Planner, Crop Rotation, Harvest Calculator, Irrigation Calculator, Fertilizer Calculator, Companion Planting, Propagation Guide, Pruning Guide, Repotting Guide, Bonsai Guide, Vertical Garden, Worm Composting, Beekeeping, Wild Bees, Butterfly Garden, Reptile Guide, Spider Guide, Marine Guide, Plant Anatomy, Cooking Guide, Wild Tea, Herb Guide, Medicinal Plants, Edible Plants, Fruit Guide, Mushroom Guide, Toxic Plants, Farm Finance, Market Prices, Global Marketplace, Plant Journal, Growth Log, Land Mapper, Drone View, Farm Task Manager, About FloraIQ.

---

## Architecture

```text
floraiq/
├── client/                  React 19 + TypeScript frontend (Vite 7)
│   └── src/
│       ├── pages/           90 tool pages
│       ├── components/      Chatbot, BottomNav, ScanOverlay, SoundID, etc.
│       ├── lib/             notifications.ts, utils
│       └── contexts/        Theme, Workstation
├── server/                  Express backend (port 7171)
│   ├── index.ts             Server entry — mounts routes + MCP server
│   ├── routes.ts            All API endpoints + rastermill image pipeline
│   └── mcp-server.ts        MCP tool server (mcporter-compatible)
├── android/                 Capacitor v8 Android project
│   └── app/src/main/
│       ├── AndroidManifest.xml   All permissions declared
│       └── java/.../MainActivity.java  Runtime permission requests on launch
├── electron/                Electron 42 desktop wrapper
│   ├── main.js              Dev: loads localhost. Prod: serves built files
│   └── serve-static.js      Local HTTP server for packaged app
├── assets/logo/             Brand assets — icon SVG, PNG sizes, ICO, wordmarks
└── config/
    └── mcporter.json        OpenClaw MCP discovery config
```

### Scan flow

1. User captures image (native Android camera via `@capacitor/camera`, or browser upload/stream on web)
2. `POST /api/identify` receives image as multipart form data
3. rastermill normalises the image (max 1600px, JPEG 85%, handles HEIC/AVIF/WebP)
4. OpenRouter routes to `nvidia/nemotron-nano-12b-v2-vl:free` with a structured identification prompt
5. Falls back to `google/gemma-4-31b-it:free` if the vision model fails
6. GBIF is called in parallel to enrich with taxonomy, occurrence count, and conservation data
7. Response includes: scientific name, common names (25 languages), confidence, toxicity level, care instructions, habitat, GBIF key, disease notes, fertilizer advice
8. Frontend renders a result card with Wikipedia extract, 12 source links, species map option, and share button

### Map flow

1. On load fetches 300 occurrences from `api.gbif.org/v1/occurrence/search`
2. Random offset (0–500) per page load so different records appear each time
3. Filter params map to GBIF taxonomy keys (Plants = kingdom 6, Birds = class Aves, etc.)
4. Text search uses the `q` param for global vernacular and scientific name matching
5. Leaflet renders markers coloured by category; click shows observation panel with external links

### Notification flow

1. On Android, `@capacitor/local-notifications` is used; on web, the browser Notification API
2. Water Tracker: adding a plant schedules a notification at 8 AM on the watering due date using `SCHEDULE_EXACT_ALARM`
3. Agri Store Finder: `watchPosition` polls every 30 seconds; when within 500m of a saved store, `sendImmediateNotification` fires
4. All permission requests are handled natively in `MainActivity.java` on first launch

### MCP server

`GET /mcp` returns a tool manifest compatible with mcporter and Claude Code.  
`POST /mcp/call/identify_organism` — takes a base64 image, runs it through rastermill + the AI pipeline, returns identification result.  
`POST /mcp/call/get_species_info` — takes a scientific name, queries GBIF species match and occurrence count.

---

## Permissions (Android)

| Permission | Used for |
| --- | --- |
| `CAMERA` | Photo capture for identification |
| `RECORD_AUDIO` | Sound ID feature |
| `ACCESS_FINE_LOCATION` | GPS for store finder, forage map, weather |
| `POST_NOTIFICATIONS` | Water tracker reminders, proximity alerts |
| `SCHEDULE_EXACT_ALARM` | Exact 8 AM watering reminders |
| `READ_MEDIA_IMAGES` | Gallery access (Android 13+) |
| `READ_EXTERNAL_STORAGE` | Gallery access (Android 12 and below) |
| `FOREGROUND_SERVICE` | Background location polling for proximity alerts |
| `WAKE_LOCK` | Keeps notifications active |

All permissions are requested at first launch by `MainActivity.java`. Hardware features (camera, microphone, GPS) are declared `required="false"` so the app installs on any device.

---

## Setup

```bash
git clone https://github.com/raymondgrey98/floraiq.git
cd floraiq
pnpm install
cp .env.example .env   # fill in your keys
```

Required keys in `.env`:

```env
OPENROUTER_API_KEY=        # openrouter.ai — free tier
GEMINI_API_KEY=            # aistudio.google.com — free
VITE_GEMINI_API_KEY=       # same key, needed for browser fallback + Sound ID
```

Optional (auth and persistent chat history — app works fine without these):

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

---

## Running locally

```bash
pnpm dev              # frontend + backend together
pnpm dev:frontend     # frontend only (port 3000)
pnpm dev:backend      # backend only (port 7171)
```

---

## Building

```bash
# Production web build → dist/public/
pnpm build

# Windows NSIS installer → dist-electron/
pnpm electron:build

# Android APK (requires Android SDK + Java 21)
pnpm build && npx cap sync android
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

Set `ANDROID_SDK_ROOT` to your Android SDK path before building, or create `android/local.properties` with `sdk.dir=C\:\\path\\to\\Sdk`.

### Signing the Android APK

```bash
keytool -genkey -v -keystore floraiq-release.keystore \
  -alias floraiq -keyalg RSA -keysize 2048 -validity 10000
```

Add to `android/app/build.gradle` under `android {}`:

```groovy
signingConfigs {
  release {
    storeFile file("../../floraiq-release.keystore")
    storePassword "your-password"
    keyAlias "floraiq"
    keyPassword "your-password"
  }
}
buildTypes {
  release { signingConfig signingConfigs.release }
}
```

Keep the keystore file out of git — it is already in `.gitignore`.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| UI | Radix UI (shadcn pattern), Framer Motion, GSAP, Lucide, Phosphor Icons |
| Maps | Leaflet, react-leaflet |
| Backend | Express 4, tsx, Node 20 |
| AI — identification | OpenRouter (Nemotron Vision + Gemma 4 fallback) |
| AI — chat + guides | Gemini 2.0 Flash |
| AI — disease | HuggingFace MobileNet (38 plant disease classes) |
| AI — sound ID | Gemini 2.0 Flash (audio context reasoning) |
| Image processing | rastermill (OpenClaw) — format normalisation, resize |
| Species data | GBIF, iNaturalist CV, OpenFarm, Wikipedia REST |
| Weather | Open-Meteo (free, no key) |
| Store locations | OpenStreetMap Overpass API + Nominatim geocoding |
| Auth + storage | Supabase (optional) |
| Notifications | @capacitor/local-notifications (Android), Web Notification API (browser) |
| Mobile | Capacitor v8 |
| Desktop | Electron 42, electron-builder (NSIS) |
| MCP integration | mcporter (OpenClaw) |

---

## APIs used

All free or free-tier. No paid API required to run the app.

| API | Purpose | Key needed |
| --- | --- | --- |
| OpenRouter | Vision-based organism identification | Yes — free tier |
| Gemini 2.0 Flash | Chat, Sound ID, Smart Guides, disease treatment | Yes — free |
| GBIF | Species occurrence data, taxonomy, conservation | No |
| iNaturalist CV | Secondary species identification | No |
| OpenFarm | Plant care guides, foraging notes | No |
| Wikipedia REST | Species descriptions | No |
| Open-Meteo | Live weather and forecasts | No |
| HuggingFace | Plant disease classification model | No |
| Xeno-canto | Bird/animal sound recordings (linked, not called) | No |
| Overpass API | Agriculture store locations from OpenStreetMap | No |
| Nominatim | Location name → GPS coordinates | No |
| Esri World Imagery | Satellite map tiles | No |

---

## Release history

| Version | Date | Notes |
| --- | --- | --- |
| v1.0.0 | 2026-06-07 | Initial public release |
| v1.0.0 (updated) | 2026-06-10 | 90 tools live, Sound ID, notifications, AgriStore overhaul, SmartGuide, weather widget, full Android permissions, signed APK |

---

## License

MIT © raymondgrey98
