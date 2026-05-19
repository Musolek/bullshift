# BullShift v3

LinkedIn jargon — decoded, no mercy.

## What's new in v3

- Full visual overhaul (Syne + Instrument Sans, yellow/orange palette, chunky shadows)
- Onboarding modal (first visit only, ? button to re-trigger)
- Tone selector: 5 stops from Diplomatic → Obliterate
- Jargon severity score with animated progress bar + verdict
- Detected jargon shown as struck-through red tags
- Dry editorial footnote from the model
- Session history (last 12 translations, clickable)
- Copy + Share output buttons
- Animated entrance (header slides down, columns fade up)
- Loading bar at top of page during translation
- Rate limiting: 20 req/min per IP (server-side, in-memory)
- Input validation + output sanitization on the API route
- ⌘/Ctrl + Enter to shift

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Anthropic SDK** (`@anthropic-ai/sdk`)
- Deployed on **Vercel**, repo on **GitHub**

## Files

```
app/
  page.js                  ← Main UI (client component)
  layout.js                ← HTML shell + metadata
  globals.css              ← Minimal reset
  api/
    translate/
      route.js             ← Server-side API route (rate limited, validated)
  privacy/page.js          ← Privacy policy (keep existing)
  terms/page.js            ← Terms (keep existing)
package.json
next.config.js
.env.example
.gitignore
```

## Replace in your repo

Only 4 files change:
1. `app/page.js`
2. `app/api/translate/route.js`
3. `app/layout.js`
4. `app/globals.css`

Everything else (package.json, next.config.js, .env, privacy, terms) stays as-is.

## Security

- **API key**: lives in `ANTHROPIC_API_KEY` env var on Vercel. Never touches the browser.
- **Rate limiting**: 20 requests/minute per IP, in-memory on the server.
- **Input validation**: text required, max 2000 chars, tone must be a known value.
- **Output sanitization**: all fields cast to string, score clamped 0–100, jargon array sliced to 8.
- **No database**: fully stateless. Nothing is stored server-side.

## Environment variables

Set in Vercel → Project → Settings → Environment Variables:

| Key                  | Value              |
|----------------------|--------------------|
| `ANTHROPIC_API_KEY`  | `sk-ant-...`       |

## Local dev

```bash
npm install
cp .env.example .env.local
# Edit .env.local — add your Anthropic key
npm run dev
# → http://localhost:3000
```

## Deploy

```bash
git add .
git commit -m "v3: visual overhaul, modal, animations, rate limiting"
git push
```

Vercel auto-deploys from `main`. Live in ~60 seconds.

## Cost

Each translation costs ~$0.001–$0.003 in Anthropic API credits.  
10,000 translations/month ≈ $10–30.  
Set a spend cap in the [Anthropic Console](https://console.anthropic.com) to sleep easy.
