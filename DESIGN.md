# FloraIQ Design System — "Botanical Night"

The single source of truth for FloraIQ's visual language. Tokens live in
`client/src/index.css`; this document explains what they mean, when to use
them, and the rules that keep 90+ screens feeling like one product.

## Philosophy

Premium, calm, nature-derived, AI-first. Every surface color is sampled from
an organic reference — forest canopy, new leaf, sunlight, river water, soil,
bloom — never from a framework's default palette. The app is **dark-first**:
it is a camera-centric product used outdoors and at night, and a dark ground
makes photography, confidence overlays, and data visualization read better.

Three rules above all:

1. **The camera is the hero.** Navigation, motion, and color hierarchy all
   point at the Identify action.
2. **Motion is physics, not decoration.** Springs and expo-out curves only;
   everything honors `prefers-reduced-motion`.
3. **Never color alone.** Every state change pairs color with weight, icon
   fill, or position (WCAG 1.4.1).

## Color tokens

Declared in `:root` (and mirrored in `.dark`) in `client/src/index.css`.
Shipped as hex for older Android WebViews; OKLCH intents are noted in the
file so the palette can be regenerated.

### Surfaces

| Token | Value | Name | Use |
|---|---|---|---|
| `--background` | `#0b120d` | Forest night | App ground |
| `--card` | `#121a14` | Canopy shadow | Cards, sheets |
| `--popover` | `#16211a` | Undergrowth | Menus, popovers |
| `--secondary` | `#1b2a20` | Fern layer | Secondary buttons, wells |
| `--muted` | `#223227` | Leaf litter | Skeletons, disabled fills |
| `--accent` | `#1e3126` | Moss | Hover/selected wash |

### Content

| Token | Value | Name | Use |
|---|---|---|---|
| `--foreground` | `#ecf2ea` | Morning mist | Primary text |
| `--muted-foreground` | `#94aa97` | Lichen | Secondary text, captions |
| `--accent-foreground` | `#baf1c6` | — | Text on moss wash |

### Brand & feedback

| Token | Value | Name | Use |
|---|---|---|---|
| `--primary` / `--leaf` | `#55c877` | New leaf | CTAs, active states, focus ring |
| `--leaf-bright` | `#7fe29d` | — | Gradient highlights only |
| `--destructive` / `--wilt` | `#e05648` | Wilt | Errors, destructive actions |
| `--sunlight` | `#e9b95c` | Sunlight | Warnings, care reminders, chart 2 |
| `--water` | `#5aa7de` | River | Info, watering features, chart 3 |
| `--bloom` | `#d976a8` | Bloom | Celebration, flowering events, chart 4 |
| `--soil` | `#a4795a` | Soil | Earth-topic accents (soil, compost) |
| `--canopy` / `--moss` | `#1e4d30` / `#3c6b4a` | — | Deep brand fills, gradient stops |

All extended colors are exposed as Tailwind utilities: `text-leaf`,
`bg-water/10`, `border-sunlight/30`, etc.

Charts use `--chart-1…5` = leaf / sunlight / water / bloom / lichen — five
hues distinguishable under deuteranopia and protanopia simulation.

### Contrast (WCAG 2.2 AA)

- `foreground` on `background`: **15.9:1** ✅
- `muted-foreground` on `card`: **6.5:1** ✅
- `leaf` on `background`: **8.4:1** ✅ (usable for text)
- `primary-foreground` on `primary`: **9.5:1** ✅

Never place `muted-foreground` on `muted` (fails). Minimum body text 13px.

## Typography

| Token | Family | Role |
|---|---|---|
| `--font-sans` | Inter Variable | UI text — everything by default |
| `--font-display` | Fraunces Variable | Hero headlines, brand moments only |

Both are self-hosted via `@fontsource-variable/*` (no network fetch — works
offline inside the APK).

Scale (mobile): 10px eyebrow/labels · 13px body · 15px section title ·
17–18px page title · `clamp(2.3rem, 9.5vw, 3.2rem)` hero. Use Fraunces at
weight 550–650 with `-0.015em` tracking; Inter for all else. Numeric data
uses `font-variant-numeric: tabular-nums`.

## Radius, spacing, elevation

- Base radius `--radius: 1rem`; derived: `sm` 10px · `md` 13px · `lg` 16px ·
  `xl` 22px · `2xl` 28px. Floating surfaces (nav dock, sheets) use `2xl`+.
- Spacing follows Tailwind's 4px grid; screen gutters 16px (mobile),
  24/32px at `sm`/`lg` via `.container`.
- Elevation tokens: `--shadow-lift` (cards), `--shadow-float` (floating
  surfaces), `--shadow-glow` (leaf-green emphasis — hero CTA/FAB only).
  Shadows are green-black, never pure black.
- Glass: `.glass-sm` / `.glass` / `.glass-strong` — green-tinted blur with a
  lichen hairline border. Use `strong` only for surfaces over moving content
  (nav dock, camera overlays).

## Motion

| Token | Curve | Use |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for entrances, presses |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero reveals |
| `--ease-in-out-soft` | `cubic-bezier(0.45, 0, 0.55, 1)` | Ambient loops (float, glow) |

Durations: press feedback 150–200ms · element entrances 300–500ms · hero
600ms · ambient 2–5s. Framer-motion springs: `stiffness 380, damping 32`
(layout), `stiffness 400, damping 18` (tap bounce). A global
`prefers-reduced-motion` override in `index.css` collapses all animation to
≤ 0.01ms — no per-component work needed, but avoid conveying *information*
through motion alone.

Utility animations: `animate-fade-in-up`, `animate-scale-in`,
`animate-float`, `animate-glow`, `skeleton-shimmer` (loading), plus
`.card-hover` / `.hover-glow` for interactive elevation.

## Navigation

`BottomNav` (`client/src/components/BottomNav.tsx`) is a floating glass dock,
mobile-only (`sm:hidden`):

- 5 destinations: Home · Library · **Identify** (raised gradient FAB) ·
  Garden · Me.
- Active tab = spring-sliding moss pill (`layoutId`) + filled icon + leaf
  color + semibold label.
- Haptic tick (`navigator.vibrate(8)`) on tab press where supported.
- Respects the gesture bar via `pb-safe` (safe-area utilities are defined in
  `index.css`).
- Tap targets ≥ 44×44px; `aria-current="page"` on the active item.

The floating AI botanist (`Chatbot.tsx`) is global and available on every
route.

## Component rules

- Buttons: primary = leaf fill / dark text; secondary = fern fill; ghost on
  glass. Destructive = wilt. One primary action per view.
- Cards: `bg-card` + `border-border` + `--shadow-lift`; hover/press uses
  `.card-hover`. Feature cards may tint with topic color at 10% opacity
  (`bg-water/10` for watering, `bg-sunlight/10` for light, …).
- Empty states: illustration or icon + one-line explanation + a single CTA.
  Encouraging, never blaming ("No plants yet — your garden starts with one
  scan.").
- Loading: skeletons (`.skeleton-shimmer`) for content, scan overlay for AI
  processing. Never a bare spinner on a blank screen.
- Toasts: sonner, `richColors`, top-center.

## Microcopy

Friendly expert, never robotic. Short sentences. Say what happened and what
to do next.

- ✅ "Great photo — strong match found."
- ✅ "Your Monstera looks healthier this week."
- ❌ "Error 422: identification failure."

Confidence is always shown as both a number and a word: "94% — very
confident" / "61% — worth a second photo".

## Accessibility checklist

- [x] AA contrast for all token pairings listed above
- [x] `prefers-reduced-motion` honored globally
- [x] Focus visible: `outline-ring/50` on every element (base layer)
- [x] Tap targets ≥ 44px in navigation
- [x] State ≠ color alone (icon weight + text weight shifts)
- [x] `aria-current` / `aria-label` on primary navigation
- [ ] Screen-reader pass per page (ongoing)
- [ ] Dynamic type scaling audit (ongoing)

## Screen map

~90 routes registered in `client/src/App.tsx`, grouped by domain:

- **Identify:** `/scan` (viewfinder → processing → results FSM), `/leaf`,
  `/flower`, `/disease`
- **Garden:** `/journal`, `/growth`, `/water`, `/calendar`, `/repot`,
  `/pruning`, `/propagation`, `/bonsai`, `/vertical`
- **Maps & field:** `/map`, `/forage`, `/landscape`, `/landmap`,
  `/droneview`, `/navigate`
- **Farm:** `/farm`, `/farmtasks`, `/finance`, `/irrigation`, `/fertilizer`,
  `/harvest`, `/rotation`, `/market`, `/agristore`
- **Knowledge:** `/history` (library), `/herbs`, `/mushroom`, `/birds`,
  `/marine`, `/reptiles`, `/spiders`, `/anatomy`, `/toxic`, `/edible`,
  `/medicinal`, and other guides
- **Survival:** `/survival`, `/survivalplants`, `/firstaid`, `/shelter`,
  `/tea`, `/medicine`
- **Account:** `/login`, `/signup`, `/profile`, `/admin`, `/about`

When adding a screen: use semantic tokens only (no raw hex in pages), wire
the route in `App.tsx`, and keep the bottom dock's five destinations stable.
