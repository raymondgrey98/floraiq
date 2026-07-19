# FloraIQ / BioScan — APK Upgrade Playbook
### 150+ concrete ideas to make the Android app world-class

Grouped by theme, roughly ordered by impact-per-effort inside each group.
✅ = already done · ⭐ = high impact · 📱 = native/APK-specific.

---

## 1. Native Android power features (📱 the "APK" wins)
1. ⭐📱 **Share-target intent** — "Share → FloraIQ" from Gallery/Camera/WhatsApp instantly identifies a photo.
2. ⭐📱 **App shortcuts** (long-press icon) → Scan, My Garden, Species Map, Sound ID.
3. ⭐📱 **Home-screen widget** — "Scan now" button + today's plant-care reminder + weather.
4. 📱 **Quick Settings tile** — one tap to open the camera scanner.
5. 📱 **Assistant / "Hey Google, identify this plant"** deep link.
6. 📱 **Material You dynamic color** — theme adapts to the user's wallpaper (Android 12+).
7. 📱 **Edge-to-edge + predictive back gesture** (Android 14/15 polish).
8. 📱 **Per-app language** picker (Android 13 `localeConfig`).
9. 📱 **Notification channels** — separate Watering / Rare-species / Community into toggleable channels.
10. 📱 **Biometric app lock** (fingerprint/face) for the journal & profile.
11. 📱 **NFC plant tags** — tap a tag on a pot to open that plant's care page.
12. 📱 **Wear OS companion** — watering reminders + "what's this" from the watch.
13. 📱 **Foreground service for BirdNET** — record ambient audio for continuous bird ID on a walk.
14. 📱 **Direct camera intent** from lock-screen shortcut.
15. 📱 **Adaptive icon + themed icon** (monochrome for Android 13 themed icons).
16. 📱 **Split-screen / foldable** layouts (species list | detail).
17. 📱 **Haptics** on successful ID, capture, and streak milestones.
18. 📱 **Picture-in-picture** for how-to-grow videos.

## 2. Identification & AI ⭐
19. ⭐ **On-device TFLite model** — instant, offline first-guess; server confirms (privacy + speed).
20. ⭐ **Top-5 candidates** ("Is it one of these?") using the existing `/api/identify/inat` endpoint.
21. **Multi-photo ID** — leaf + flower + bark together for higher accuracy (Pl@ntNet-style).
22. **Confidence-aware UX** — "Not sure? Add another angle" when confidence < 60%.
23. **Common confusions** — "often mistaken for X (toxic)" warnings.
24. ✅ **Similar species strip** (iNaturalist photos).
25. **Disease severity meter** + progression tracking from repeat photos.
26. **Batch scan** — identify a whole photo album at once.
27. **Video scan** — pan across a plant, best frame auto-picked.
28. **Faster/cheaper model routing** — small model first, escalate only on low confidence.
29. **Region-aware ranking** — bias results to species seen near the user (GBIF density).
30. **"Explain this ID"** — AI shows the visual features it used.

## 3. Camera & capture UX ⭐
31. ⭐ **Live focus ring + auto-capture** when the subject is sharp.
32. **Macro / zoom toggle** for tiny insects.
33. **Grid & level overlay**; **flash & torch** control.
34. **Burst mode** → auto-pick the sharpest frame.
35. **Background blur removal / crop-to-subject** before sending to AI.
36. **Reticle hints per mode** ("center the flower", "fill frame with the leaf").
37. **Retake vs Use** review screen with quality score.
38. **Voice shutter** ("scan") for hands-free field use.

## 4. Species pages & content ⭐
39. ⭐ **Full-bleed hero + floating ID card** (PictureThis polish).
40. **Range map** (GBIF heat) embedded per species.
41. **Seasonality** — when it flowers/fruits in the user's region.
42. **Toxicity to pets/children** with clear icons.
43. **Look-alike safety** for edibles/mushrooms (deadly twins).
44. **Audio playback** of bird/insect calls (Xeno-canto).
45. **3D / AR view** of the plant.
46. **"Grow this" one-tap** → adds care plan to My Garden.
47. **Sources & citations** (already 12 DBs) + "last verified" date.
48. **User photos gallery** per species (community-contributed).

## 5. Community & citizen science (iNaturalist-style) ⭐
49. ⭐ **Post an observation** (photo + GPS + notes) to a shared feed.
50. ⭐ **Community ID + voting** → **"Research Grade"** badge.
51. **Activity feed** — follow people, comment, agree/disagree.
52. **Projects** — "Birds of Borneo", "My street trees", bioblitzes.
53. **Leaderboards** — top identifiers, most species this month.
54. **Expert verification** program (verified botanists).
55. **Data export to GBIF/iNaturalist** — real scientific contribution.
56. **Nearby observations** map layer.

## 6. Gamification & retention ⭐
57. ⭐ **Scan streaks** + streak-freeze.
58. ⭐ **Badges / achievements** (First Fungus, 50 Species, Night Owl).
59. **Species collection ("Pokédex")** — % of local flora discovered.
60. **Daily challenge** ("find something yellow", "a pollinator").
61. **Levels & XP**, seasonal events, limited-time species.
62. **Share cards** — beautiful auto-generated "I found X" images for IG/TikTok.
63. **Referral rewards**.

## 7. My Garden & plant care ⭐
64. ✅ **Add to My Garden** + watering reminders.
65. ⭐ **Smart watering** adjusted by live weather (skip if it rained).
66. **Care calendar** (water/fertilize/repot/prune) with history.
67. **Plant health journal** — photo timeline + AI health check-ins.
68. **Light meter** using the phone sensor → "this spot is too dark".
69. **Soil/pot recommendations** per species.
70. **Harvest tracker** for edible/farm plants.
71. **"Doctor" mode** — recurring disease monitoring.

## 8. Maps & exploration
72. **Observation heatmap** with taxa filters.
73. **Forage map** — edible/medicinal near me (seasonal).
74. **Trail mode** — log a walk, auto-tag species along the route.
75. **Offline map tiles** for remote areas.
76. **Protected-area & invasive-species overlays**.
77. **"Rare species near you" alerts**.

## 9. Offline & performance ⭐
78. ⭐ **Offline-first** — queue scans, sync when back online.
79. ⭐ **Code-split the bundle** (currently ~4 MB) → faster cold start.
80. **Offline species packs** (download your region).
81. **Image compression before upload** (already normalized server-side; do client-side too).
82. **Skeleton loaders + optimistic UI** everywhere.
83. **Prefetch** likely-next screens.

## 10. Notifications & reminders
84. **Watering due** (channel).
85. **"Great scanning weather today"** nudges.
86. **New community ID on your observation**.
87. **Seasonal**: "Durian season started near you".
88. **Streak-at-risk** reminder.

## 11. Monetization
89. **Freemium** — X free scans/day; Pro = unlimited + care plans + disease + offline.
90. **Pro subscription** (monthly/annual) via Google Play Billing.
91. **B2B species/ID API** (metered) for agri-tech, education, eco-tourism.
92. **Org/education licenses**; **white-label** partnerships.
93. **Marketplace affiliate** (seeds, tools) — already have AgriStore/Marketplace.
94. **Donations / "support conservation"** tier.

## 12. Accessibility & i18n
95. **TalkBack labels** on every control; large touch targets.
96. **High-contrast & dynamic font scaling**.
97. **25+ languages** (Malay, Iban, Mandarin, Tamil…) with per-app language.
98. **Voice output** — read species info aloud.
99. **Colorblind-safe** risk badges (icons + text, not just color).

## 13. Security, privacy & trust
100. ✅ **Least-privilege permissions** (removed background location + unused media perms).
101. **Runtime permission rationale** dialogs ("why we need the camera").
102. **Local-only mode** — identify without an account.
103. **Data export & delete** (GDPR/PDPA).
104. **EXIF/GPS stripping** option before sharing.
105. **Certificate pinning** for the API.
106. **Play Integrity API** to protect the backend.

## 14. Data integrations (mostly free)
107. **Pl@ntNet** (multi-organ), **Trefle** (1M+ plants), **PlantNet**.
108. **Xeno-canto / eBird** (bird sound + sightings).
109. **PubChem** (toxicity), **USDA FoodData** (nutrition), **IUCN Red List** (conservation).
110. **Open-Meteo** (weather-aware care), **MycoPortal** (fungi), **EOL** (encyclopedia).

## 15. Onboarding & growth
111. **3–4 slide premium onboarding** with a "scan your first plant" hook.
112. **Sample scan** if the user has no photo yet.
113. **Empty-state CTAs** everywhere (My Garden, Journal, Map).
114. **Deep links** (`floraiq://species/…`) for sharing.
115. **App-clip-style instant scan** via QR at nurseries/parks.

## 16. Infrastructure & release quality
116. **Signed AAB → Play Store** (keystore ready ✅).
117. **CI/CD** — GitHub Actions build + Codemagic iOS.
118. **Crash reporting** (Sentry/Firebase Crashlytics).
119. **Analytics** (privacy-friendly) for funnels & retention.
120. **Remote config / feature flags** for safe rollouts.
121. **In-app update** prompts (Play In-App Updates API).
122. **Automated tests** (Vitest + Playwright) — vitest bumped ✅.

---

### Suggested first 5 to ship next
1. Top-5 candidates ("is it one of these?") — endpoint already exists.
2. Share-target intent (📱) — huge virality, low effort.
3. Skeleton loaders + code-split bundle — instant-feel.
4. Community observation + Research Grade (the iNaturalist moat).
5. Freemium + Play Billing (turn it into a business).
