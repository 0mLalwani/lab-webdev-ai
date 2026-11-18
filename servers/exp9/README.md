# exp9 · AI Text Generation Studio

Web app for AI-powered text generation — **Express.js + OpenAI/Gemini**
(providers via plain REST, no SDKs), UI at **`/exp9`**, API on **port 4009**.

```bash
npm run server:exp9        # or: npm run server:all
```

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Server + AI provider status |
| GET | `/api/generate/config` | Which provider is active / demo mode |
| POST | `/api/generate` | `{ prompt, mode?, provider?, maxTokens? }` → `{ text, provider, model, demo, mode }` |

Modes: `freeform`, `summarize`, `rewrite`, `brainstorm`, `explain`.
Validation: prompt 4–4000 chars, mode/provider whitelists → `400` with details.

## Getting a free API key (Gemini — recommended)

1. Open **https://aistudio.google.com/apikey** (sign in with a Google account)
2. Click **Create API key** and copy it
3. Copy `.env.example` → `.env` and set `GEMINI_API_KEY=your key`
4. Restart the server — the UI banner flips from **DEMO MODE** to **GEMINI**

For OpenAI: https://platform.openai.com/api-keys → set `OPENAI_API_KEY`
(paid account required). Both keys can be set — `AI_PROVIDER` picks the
default, and the UI lets you override per request.

## Demo mode (no key required)

With no keys configured the endpoint still works end-to-end and returns
realistic, clearly-labeled DEMO output — handy for grading the pipeline
(validation → provider layer → UI) without spending anything.

## Files

- `servers/lib/ai.js` — shared provider layer (OpenAI + Gemini + demo)
- `servers/exp9/routes/generate.js` — mode system-prompts, validation, demo templates
- `app/exp9/page.tsx` — AI Text Studio UI (mode chips, provider selector, copy, history)
