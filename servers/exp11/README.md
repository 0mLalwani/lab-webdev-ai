# exp11 · AI Content Generator

AI-based content generation for **blogs, emails and social media posts** —
Express.js + shared OpenAI/Gemini provider layer, UI at **`/exp11`**,
API on **port 4011**.

```bash
npm run server:exp11        # or: npm run server:all
```

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/content/config` | Active provider / demo flag |
| POST | `/api/content/generate` | `{ type, topic, tone?, length?, keyPoints?, provider? }` |

**Types:** `blog` (Markdown post w/ title+sections) · `email` (subject+body) ·
`instagram` (caption+hashtags) · `x` (numbered thread ≤280/tweet) ·
`linkedin` (hook+insights+hashtags)

**Tones:** professional · casual · friendly · witty · persuasive
**Lengths:** short · medium · long (drives `maxTokens` + instructions)

Validation → `400` with per-field `details` (unknown type/tone/length,
topic 3–1000 chars).

## Demo mode (no key)

Returns structured, topic-filled templates for every type — the whole
pipeline (validation → system prompt → provider → UI) works end-to-end
without spending anything. Add `GEMINI_API_KEY` (free:
https://aistudio.google.com/apikey) or `OPENAI_API_KEY` to `.env` and
restart for real generations.

## Files

- `servers/exp11/routes/content.js` — type/tone/length system prompts + demo templates
- `app/exp11/page.tsx` — content studio UI (type cards, tone chips, copy/download)
