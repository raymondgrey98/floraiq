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

```bash
pnpm build && npx cap sync android && npx cap open android
```

## Features

- species ID from photo (plants, birds, insects, fungi, marine, reptiles)
- plant disease detection — HuggingFace MobileNet
- foraging map via GBIF
- farm assistant (irrigation, soil, pest, market prices)
- water tracker, plant journal, wilderness guides
- AI chat with session history (Supabase)
- 70+ tools

## Tech

React 19, Vite 7, Tailwind v4, Express, Gemini, OpenRouter, Leaflet, Supabase, Capacitor

## DB

Run `supabase/migrations/001_floraiq_schema.sql` in the Supabase SQL editor before using auth or chat.

## License

MIT
