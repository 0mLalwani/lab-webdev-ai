# exp12 · AI Image Generation & Captioning

Image AI web app using **publicly available AI APIs** — UI at **`/exp12`**,
API on **port 4012**.

```bash
npm run server:exp12        # or: npm run server:all
```

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/image/config` | Provider info + `geminiConfigured` (drives the caption tab) |
| POST | `/api/image/generate` | `{ prompt, style?, aspect?, seed?, provider? }` → `{ url, seed, provider, demo }` |
| POST | `/api/image/enhance` | `{ prompt }` → AI-polished text-to-image prompt |
| POST | `/api/image/caption` | `{ image: dataURL, mimeType }` → `{ caption }` — **needs `GEMINI_API_KEY`** |

## Image generation providers

| Provider | Key needed? | Notes |
| --- | --- | --- |
| **pollinations** (default) | **No** | Public API (https://pollinations.ai) — works instantly out of the box |
| openai | `OPENAI_API_KEY` | DALL·E 3, real API billing |
| demo | No | Local generated SVG placeholder art (always works) |

Styles: photoreal · 3d · watercolor · anime · neon · pixel
Aspects: square 1024² · portrait 768×1152 · landscape 1152×768
(seeds are returned so the exact image can be reproduced)

## Image captioning

Uploads are sent client-side as base64 → **Gemini vision**
(`gemini-2.0-flash` + `inline_data`) → 1–3 sentence caption.
Without `GEMINI_API_KEY` the endpoint returns a clear `400` and the UI
shows an "activate with a free key" notice (no fake captions).
Free key: https://aistudio.google.com/apikey → `.env` → restart.

## Files

- `servers/exp12/routes/image.js` — Pollinations/OpenAI/demo generation, prompt enhance, Gemini captioning
- `app/exp12/page.tsx` — tabbed UI (Generate gallery + Caption upload)
