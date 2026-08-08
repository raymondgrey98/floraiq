# FloraIQ — Business Playbook

How to turn FloraIQ into a business you can run **without hiring engineers**.
Everything here is already set up in this repo.

---

## 1. The model: open source *and* sellable

FloraIQ is **dual-licensed** ([LICENSE](LICENSE) + [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md)):

- **AGPL-3.0 (free)** — anyone can use it, but if a *company* uses it in a product
  or runs it as a service, they must publish all of their own source code.
- **Commercial licence (paid)** — companies pay you to skip that obligation.

That second clause is the entire business. Companies will not open-source their
codebase, so they buy a licence instead. This is exactly how GitLab, Grafana,
MongoDB and Sentry make money while staying open source.

**You keep the copyright.** Being on GitHub does not give it away.

---

## 2. What you sell

| Product | Buyer | Effort to run |
|---|---|---|
| **Pro subscription** in the app | Consumers | Automated — Play Store handles billing |
| **Commercial licence** | Companies embedding FloraIQ | An email + an invoice |
| **Hosted identification API** | Agri-tech, education, apps | Automated once deployed |
| **White-label app** | Parks, tour operators, NGOs | Rebrand + deploy (a day of work) |
| **Support/SLA retainer** | Enterprise | Ongoing, priced accordingly |

Set your prices in [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md) — the table is
there with placeholders.

---

## 3. Turning on revenue (already built)

`client/src/lib/entitlements.ts` is the freemium engine:

- Free users get **10 scans/day**, Pro is unlimited
- **Limits are OFF by default** so your own app is unlimited
- To sell, build with `VITE_ENFORCE_LIMITS=true`
- `activatePro(licenceKey)` flips a user to Pro after payment

For consumer payments, use **Google Play Billing** (Play takes 15% under
US$1M/yr). For company invoices, plain bank transfer or Stripe Payment Links —
no code needed.

> Before charging money, move the limit check to the server (see §6). Client-side
> limits are fine for testing demand, but they can be bypassed.

---

## 4. Hosting it without an engineer

**[render.yaml](render.yaml)** — one-click deploy:

1. Go to [render.com](https://render.com), sign in with GitHub
2. **New + → Blueprint →** pick the `floraiq` repo → **Apply**
3. Paste your `GEMINI_API_KEY` when prompted
4. Done. Every `git push` redeploys automatically.

**[Dockerfile](Dockerfile)** — for enterprise customers who insist on running it
on their own servers (a common requirement in big deals).

Once hosted, set `VITE_API_URL` to your Render URL and rebuild the app. Your API
key then lives **on the server**, not inside the APK — which is what makes the
public app safe to distribute.

---

## 5. Getting customers

**Start narrow.** "Plant ID for everyone" is too broad to sell. Pick one:

1. **Agriculture** — crop disease detection for farms and agri-suppliers.
   FloraIQ's Farm tools already fit; this is the highest-value niche.
2. **Education** — schools running biodiversity fieldwork. Sell per-classroom.
3. **Eco-tourism** — lodges and parks wanting a branded nature app for guests.

**Where to find them:** local agriculture departments, agri-supply shops,
university biology departments, tourism boards. Start where you are —
South-East Asian biodiversity is under-served by PictureThis and iNaturalist.

**What to show:** the app on your phone, identifying a plant in 3 seconds.
That demo sells better than any slide deck.

---

## 6. The one thing you will need help with

Being straight with you: **"no engineer ever" is not realistic** for a software
business. What *is* realistic:

- **Deploys, updates, monitoring** → automated (Render + auto-deploy) ✅
- **New features and bug fixes** → you can do these with an AI assistant ✅
- **Server-side payment/licence enforcement** → needs doing properly **once**,
  before you take real money. Budget a few days of contract work, or have an AI
  assistant build it and a paid security review check it.
- **Anything holding customer data** → privacy law (GDPR/PDPA) applies. Get a
  lawyer to review your terms before selling to companies.

Everything else in this repo is already automated.

---

## 7. First five steps

1. Set your prices in [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md) and add your email.
2. Deploy to Render (§4) so the public app doesn't ship your API key.
3. Pick **one** niche from §5 and talk to five potential customers.
4. Build with `VITE_ENFORCE_LIMITS=true` and publish to the Play Store.
5. Move limit checks server-side before taking payment.

---

*Not legal or financial advice — get a lawyer to review licences and contracts
before signing deals.*
