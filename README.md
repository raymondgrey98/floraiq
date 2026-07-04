# FloraIQ

AI species identification app — camera in, name out. Web + Android.

## Setup

```bash
pnpm install
pnpm dev
```

`.env`:

```env
OPENROUTER_API_KEY=
GEMINI_API_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Android

### Install on your phone (no PC needed)

Every push to `main` builds a debug APK on GitHub Actions and publishes it to the
[`apk-latest` release](../../releases/tag/apk-latest). On your Android phone:

1. Open the release page and download `FloraIQ-debug.apk`.
2. Open the file and allow "install from unknown sources" when prompted.
3. If an older build is already installed, uninstall it first (debug signatures differ between CI runs).

You can also trigger a build manually from the Actions tab (**Android APK** workflow → *Run workflow*).

### Build locally

```bash
pnpm build && npx cap sync android && npx cap open android
```

The `android/` project is committed. `AndroidManifest.xml` declares camera, location
(fine + coarse), photos/media (`READ_MEDIA_IMAGES` on Android 13+), and notification
permissions — Capacitor prompts for them at runtime when a page first uses the camera
or geolocation.

> Note: the mobile app expects the Express API (`/api/*`) to be reachable. For device
> testing against a dev machine, set `server.url` in `capacitor.config.ts` to your
> machine's LAN address (e.g. `http://192.168.x.x:3000`) and run `npx cap sync android`.

## Features

- species ID from photo (plants, birds, insects, fungi, marine, reptiles)
- plant disease detection — HuggingFace MobileNet
- foraging map via GBIF
- weather intelligence map — live rain radar + cloud satellite (RainViewer), heat/wind grid (Open-Meteo), tap-anywhere 7-day forecast, global
- agri market finder — pinpoint GPS + OpenStreetMap stores worldwide, best-pick ranking, Google Maps / Waze directions
- farm assistant (irrigation, soil, pest, market prices) — region-aware, all 196 countries
- EXIF provenance: gallery photos keep the location where they were *taken* (needs `ACCESS_MEDIA_LOCATION` on Android)
- 13-language UI (English, Español, Português, Français, Deutsch, Русский, العربية with RTL, हिन्दी, 中文, 日本語, Bahasa Indonesia, Bahasa Melayu, Kiswahili)
- water tracker, plant journal, wilderness guides
- AI chat with session history (Supabase)
- 70+ tools

## Tech

React 19, Vite 7, Tailwind v4, Express, Gemini, OpenRouter, Leaflet, Supabase, Capacitor

## DB

Run `supabase/migrations/001_floraiq_schema.sql` in the Supabase SQL editor before using auth or chat.

## License

MIT
