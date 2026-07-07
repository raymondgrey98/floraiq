# FloraIQ — Mobile Release Guide

Same FloraIQ codebase → Android + iPhone, via Capacitor. No rewrite.

---

## Rebuild the app after code changes (one command chain)

```bash
pnpm build                              # build the web app
npx cap sync android                    # copy web build into the Android project
cd android && sh ./gradlew assembleDebug   # debug APK (for testing on your phone)
# or, for the store:
cd android && sh ./gradlew bundleRelease   # signed .aab (for Google Play)
```

Outputs:
- Debug APK → `android/app/build/outputs/apk/debug/app-debug.apk`
- Release AAB → `android/app/build/outputs/bundle/release/app-release.aab`

---

## 1. Android — install on your phone (testing)

File on Desktop: **`FloraIQ-debug-20260629.apk`**

1. Copy the `.apk` to your Samsung Galaxy A56 (USB, or upload to Drive/Telegram → download on phone).
2. Tap it → allow "install from this source" → Install → Open.
3. Or via USB with debugging on: `adb install -r FloraIQ-debug-20260629.apk`

---

## 2. Android — publish to Google Play (production)

File on Desktop: **`FloraIQ-release-20260629.aab`** (signed)

1. Create a Google Play Console account (one-time US$25): https://play.google.com/console
2. Create app → fill listing (name, description, screenshots, icon, privacy policy).
3. Production → Create release → **upload the `.aab`**.
4. Roll out. (First review can take a few days.)

> Signing: the release key is `floraiq-release.keystore` (alias `floraiq`). **Keep this file + its
> password safe and backed up** — you need the *same* key for every future update. Consider letting
> Google "Play App Signing" manage it.

---

## 3. iPhone — build in the cloud (no Mac needed)

Config file: **`codemagic.yaml`** (already in the project root).

1. Put this project on GitHub/GitLab/Bitbucket (Codemagic builds from a Git repo).
2. Sign up at https://codemagic.io and connect the repo.
3. Apple Developer account (US$99/yr) — required by Apple for any iOS build.
4. In Codemagic: Teams → Integrations → add an **App Store Connect API key**, name it
   `CodemagicAppStoreKey` (matches `codemagic.yaml`).
5. Run the **`ios-floraiq`** workflow. It builds web → adds iOS → produces a signed `.ipa` →
   uploads to TestFlight.

---

## Known mobile follow-ups
- **Camera**: scan screen now uses the native `@capacitor/camera` on phones (web keeps the live
  viewfinder). Test it on the A56.
- **Bundle size**: the web JS bundle is large (~4 MB). Code-splitting would speed up first load —
  worth doing before a wide launch.
- **Push notifications**: `@capacitor/push-notifications` is installed but needs a
  `google-services.json` (Firebase) to actually deliver.
