# FloraIQ — Project Memory File
> READ THIS FIRST EVERY SESSION. DO NOT SKIP.

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
- **GitHub repos:** github.com/raymondgrey98/bioscan-app + github.com/raymondgrey98/plant-scanner

---

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **UI:** Radix UI components (shadcn/ui style), dark theme, emerald green accents
- **Backend:** Express.js (port 3005), proxied via Vite (port 3000+)
- **AI:** Anthropic Claude API (chatbot) + AirLLM/HuggingFace (plant identification)
- **Mobile:** Capacitor v8 (Android)
- **Android SDK:** `C:\Users\USER\AppData\Local\Android\Sdk`
- **Java:** `C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot`

---

## Pages Built
| Route | Page | Status |
|---|---|---|
| `/` | Home (hero, feature cards — ALL CLICKABLE) | ✅ Done |
| `/scan` | Identify Organism (upload/camera, 7 scan modes) | ✅ Done |
| `/scan-results` | Scan Results page | ✅ Done |
| `/survival` | Survival Toolkit | ✅ Done |
| `/landscape` | Landscape Intelligence (OSINT) | ✅ Done |
| `/map` | Species Map | ✅ Done |
| `/farm` | Farm Assistant | ✅ Done |
| `/history` | History / Species Library | ✅ Done |
| `/profile` | User Profile | ✅ Done |
| `/login` | Login | ✅ Done |
| `/signup` | Signup | ✅ Done |
| `/admin` | Admin Dashboard | ✅ Done |

---

## Backend API Routes
- `POST /api/identify` — plant ID from image (AirLLM/HuggingFace)
- `POST /api/identify/batch` — multiple images
- `POST /api/camera/start|stop|capture` — camera stream
- `POST /api/chat` — real AI chatbot (Claude Haiku)
- `POST /api/bioscan/sync` — geolocation + species record
- `GET /api/species/:name` — species detail
- `POST /api/translate` — multi-language translation

---

## Chatbot
- Powered by **Claude Haiku** via Anthropic API
- Needs `ANTHROPIC_API_KEY` in `.env` file at project root
- Full conversation history maintained per session
- Floating button bottom-right of every page

---

## How to Run
```bash
cd "C:\Users\USER\Desktop\floraiq-bioscan\floraiq-extract"
pnpm dev
# Frontend: http://localhost:3000 (or next free port)
# Backend: http://localhost:3005
```

## How to Build APK
```bash
pnpm build
npx cap sync android
cd android
./gradlew.bat assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## What Still Needs Work
- [ ] Real AI plant identification (needs HF_API_KEY or switch to Claude Vision)
- [ ] Species Library — needs real data (currently placeholder)
- [ ] Camera live scan (currently upload only)
- [ ] User authentication (login/signup not wired to backend)
- [ ] Water tracker / care reminders (PictureThis feature to build)
- [ ] Plant disease diagnosis (PictureThis feature to build)
- [ ] Push to GitHub properly (only skeleton is on GitHub now)
- [ ] Release/signed APK for Play Store

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
- Memory file: always read `CLAUDE.md` and `claude alzheimer problem.md` first
- This is a sole proprietorship — USER owns all code

---

## Other Projects (do not confuse)
- **ARGUS** — separate surveillance/intelligence UI at `C:\Users\USER\argus` — DO NOT touch
- **Sentinel** — security project
- **FusionGraph AI** — at `C:\Users\USER\fusiongraphai`
