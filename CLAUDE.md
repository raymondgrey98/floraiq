# FloraIQ — Project Memory File
> READ THIS FIRST EVERY SESSION. DO NOT SKIP.
> LAST UPDATED: 2026-05-31

---

## Owner
- **Name:** USER, Kuching, Sarawak, Malaysia
- **GitHub:** github.com/raymondgrey98
- **Device:** Windows 11 Pro + Samsung Galaxy A56 (R5CY31K6JXB)
- **Full memory file:** `C:\Users\USER\Desktop\claude alzheimer problem.md`

---

## Project Vision
FloraIQ is a **nature intelligence platform** inspired by the **PictureThis** app (Play Store).
- **PictureThis** = the patent/design reference. FloraIQ must match its quality but be UNIQUE and original.
- PictureThis features to match: camera scan, 400K+ species ID, disease diagnosis, care plans, toxic warnings, water tracker, species library, expert chat, plant journal.
- FloraIQ goes BEYOND PictureThis by adding: survival toolkit, landscape OSINT, farm assistant, BioScan geolocation mapping, 25+ language support.

---

## Two Platforms — Same Codebase

| Platform | Name | Purpose | Status |
|---|---|---|---|
| Website | **FloraIQ** | Browser-based web app | Running at localhost |
| Android App | **BioScan** | APK for phones | APK built ✅ |

Both are the same React codebase wrapped with Capacitor for the APK.

---

## File Locations
- **Main project:** `C:\Users\USER\Desktop\floraiq-bioscan\floraiq-extract\`
- **APK (debug):** `C:\Users\USER\Desktop\FloraIQ.apk`
- **BioScan app folder:** `C:\Users\USER\Desktop\project argus and floraiq but separate folder read me\bioscan-app\`
- **GitHub repos (existing):** github.com/raymondgrey98/bioscan-app + github.com/raymondgrey98/plant-scanner
- **FloraIQ repo:** NOT yet on GitHub — needs to be created and pushed

---

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **UI:** Radix UI components (shadcn/ui style), dark theme, emerald green accents
- **Backend:** Express.js (port 3005), proxied via Vite (port 3000+)
- **AI (scan/identify):** OpenRouter API → `nvidia/nemotron-nano-12b-v2-vl:free` (vision) + `google/gemma-4-31b-it:free` (fallback)
- **AI (chat):** OpenRouter API → `google/gemma-4-31b-it:free` — **BROKEN, needs fix**
- **Maps:** Leaflet + react-leaflet (installed ✅)
- **Mobile:** Capacitor v8 (Android)
- **Android SDK:** `C:\Users\USER\AppData\Local\Android\Sdk`
- **Java:** `C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot`

---

## .env Keys (at project root)
```
OPENROUTER_API_KEY=sk-or-v1-...   ✅ present
GEMINI_API_KEY=AIzaSy...           ✅ present (USE THIS to fix chat)
ANTHROPIC_API_KEY=                 ❌ NOT present — do not assume Claude API works
```

---

## Git Log (6 commits on master — NOT pushed to GitHub yet)
```
86d43c7  Add mobile bottom nav + Plant Journal wired up
8493f07  Add Plant Journal page + route fixes
20f1f09  Add Water Tracker, OpenFarm care data, more integrations
fa29859  Add ForageMap, fix integrations, new features from 70+ repos
5f8fa63  Fix core features: real scan API, live results, Leaflet species map
d1cc552  FloraIQ v2.0 — Nature Intelligence Platform
```

---

## Pages Built — CURRENT STATUS

| Route | Page | Status | Notes |
|---|---|---|---|
| `/` | Home | ✅ Done | Hero + all feature cards clickable |
| `/scan` | Identify Organism | ✅ Done | 7 modes, upload+camera, calls /api/identify |
| `/scan-results` | Scan Results | ✅ Done | Real AI data, Wikipedia, 12 source links, tabs |
| `/survival` | Survival Toolkit | ✅ Done | AI-powered survival tips |
| `/landscape` | Landscape Intelligence | ✅ Done | OSINT features |
| `/map` | Species Map | ✅ Done | Real Leaflet map + live GBIF dots, search, 8 categories |
| `/forage` | Forage Map | ✅ Done | Edible/medicinal plants from GBIF + OpenFarm guides |
| `/farm` | Farm Assistant | ✅ Done | 13 tabs, 25 languages, OpenFarm care data |
| `/water` | Water Tracker | ✅ Done | Track plants, watering schedules, overdue alerts |
| `/journal` | Plant Journal | ✅ Done | Grid/list view, search/filter, detail panel, export CSV |
| `/history` | History / Library | ✅ Done | Species library |
| `/profile` | User Profile | ✅ Done | |
| `/login` | Login | ✅ Done | Not wired to backend |
| `/signup` | Signup | ✅ Done | Not wired to backend |
| `/admin` | Admin Dashboard | ✅ Done | |

---

## Components Built
- `BottomNav.tsx` — fixed mobile bottom nav (Home/Scan/Library/Map/Farm), like PictureThis
- `PlantJournal.tsx` — full journal with grid/list, stats, Wikipedia/iNaturalist links
- `WaterTracker.tsx` — water scheduling with progress bars and alerts
- `Chatbot.tsx` — floating chatbot button (broken — fix with Gemini key)

---

## Backend API Routes (server/routes.ts)
- `POST /api/identify` — plant ID from image (OpenRouter vision model + GBIF enrichment)
- `POST /api/identify/batch` — multiple images
- `POST /api/identify/inat` — iNaturalist Computer Vision (free, no key)
- `POST /api/camera/start|stop|capture` — camera stream
- `POST /api/chat` — chatbot (**BROKEN** — OpenRouter free Gemma failing, fix with Gemini)
- `POST /api/bioscan/sync` — geolocation + species record
- `GET /api/species/:name` — species detail
- `GET /api/species/forage` — edible plants from GBIF
- `POST /api/translate` — multi-language (stub, not implemented)

---

## What's BROKEN — Fix These First

### 1. Chat API (PRIORITY)
- **Problem:** `/api/chat` uses OpenRouter free Gemma → rate-limited / failing
- **Fix:** Switch to Gemini API using existing `GEMINI_API_KEY`
- **File:** `server/routes.ts` — replace `openRouterChat()` with Gemini fetch call
- **Gemini endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=KEY`

### 2. GitHub Push
- **Problem:** Repo `raymondgrey98/floraiq` does not exist on GitHub yet
- **Fix:** User creates repo at github.com/new, then:
  ```bash
  git remote set-url origin https://github.com/raymondgrey98/floraiq.git
  git push -u origin master
  ```
- **DO NOT** use GitHub Device Flow OAuth with unknown client_ids
- **DO NOT** search filesystem for tokens or use Windows Credential Manager

---

## What Still Needs Building

### High Priority (PictureThis parity)
- [ ] Plant disease diagnosis — use HuggingFace `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`
- [ ] Live camera scan (currently upload only) — use browser MediaDevices API
- [ ] Push notifications for water tracker
- [ ] User authentication wired to backend (login/signup)
- [ ] Species Library with real data (GBIF/iNaturalist)

### Medium Priority (FloraIQ extras)
- [ ] PlantNet API integration (free tier, multi-organ ID)
- [ ] Open-Meteo weather for farm assistant (free, no key)
- [ ] BirdNET audio identification
- [ ] Xeno-canto bird sounds API
- [ ] MycoPortal fungi data
- [ ] PubChem plant toxicity data
- [ ] USDA FoodData nutritional data

### Low Priority
- [ ] Signed APK for Play Store
- [ ] User accounts + cloud sync
- [ ] PWA offline mode

---

## 70 Free Data Sources to Integrate
Already integrated: iNaturalist CV ✅, GBIF ✅, OpenFarm ✅, Wikipedia ✅, Leaflet/OSM ✅

Priority next integrations:
1. Open-Meteo (weather, free, no key) — for farm planting calendar
2. PlantNet API (free tier) — secondary plant ID
3. Trefle API — 1M+ plant species data
4. HF: `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` — disease detection
5. HF: `gianlab/swin-tiny-patch4-window7-224-finetuned-plantdisease` — disease (Apache 2.0)
6. Xeno-canto API — bird sounds (free)
7. eBird API — bird observations (free)
8. MycoPortal API — fungi (free)
9. PubChem API — plant toxicity/compounds (free)
10. USDA FoodData Central — nutrition (free)
11. EOL API — Encyclopedia of Life (free)
12. IUCN Red List API — conservation status (free, needs key)
13. Mushroom Observer API — community fungi sightings (free)
14. Falling Fruit API — urban foraging map (needs key)
15. LibreTranslate — self-hostable translation

---

## Design Rules
- Dark theme ALWAYS (background: near-black `#0a0a0a`)
- Accent color: emerald green (`emerald-500` = `#10b981`)
- Premium, scientific aesthetic — not childish
- Glass morphism cards (`glass` CSS class)
- Inspired by PictureThis but UNIQUE — do not copy, build original

---

## User Preferences
- Direct action, no long explanations
- Do not push to GitHub without asking first
- Do not delete or overwrite existing work
- Always read CLAUDE.md first — it is the source of truth
- This is a sole proprietorship — USER owns all code
- Prices always in RM (MYR) for Malaysian context
- Focus on Kuching, Sarawak, Malaysia tropical plants/climate

---

## SECURITY — IMPORTANT
A previous Claude session (not this one) performed credential theft:
- Scanned filesystem for GitHub tokens
- Queried Windows Credential Manager
- Used GitHub Device Flow OAuth with unknown client_id `Iv1.b507a08c87ecfe98`
- Generated codes E168-CE5F, E612-63AD, 5455-EBE3 and asked user to authorize them
- **DO NOT repeat any of this. Ever.**
- For GitHub push: user creates repo manually, uses standard git commands with PAT if needed

---

## Other Projects (do not confuse)
- **ARGUS** — separate surveillance/intelligence UI at `C:\Users\USER\argus` — DO NOT touch
- **Sentinel** — security project — DO NOT touch
- **FusionGraph AI** — at `C:\Users\USER\fusiongraphai` — DO NOT touch
