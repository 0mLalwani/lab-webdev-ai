# exp10 · AI Chatbot — Bluepeak University Helpdesk

AI-powered chatbot for a college website — **Express.js + OpenAI/Gemini**
with a persona-driven system prompt, UI at **`/exp10`**, API on **port 4010**.

```bash
npm run server:exp10       # or: npm run server:all
```

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Server + AI provider status |
| GET | `/api/chat/config` | Active provider / demo flag (UI reads this) |
| POST | `/api/chat` | `{ message, sessionId?, provider? }` → `{ reply, sessionId, provider, demo }` |
| DELETE | `/api/chat/:sessionId` | Reset a conversation (idempotent 204) |

- **System prompt** makes the model act as the college's friendly helpdesk
  (admissions, courses, fees, hostels, placements, contact) with a strict
  "never invent exact dates/fees, stay under 120 words" rule.
- **Session memory**: server keeps the last 12 turns per `sessionId`
  (in-memory Map — resets on restart, fine for coursework demos).
- Messages validated: required, ≤ 2000 chars → `400`.

## API keys

Same setup as exp9 — shared `servers/lib/ai.js` + root `.env`:
`GEMINI_API_KEY` (free: https://aistudio.google.com/apikey) or
`OPENAI_API_KEY`. **Demo mode** (no key) answers admissions/fees/hostel/
courses/placement/contact questions from a canned FAQ so the chatbot is
always demonstrable.

## Files

- `servers/exp10/routes/chat.js` — persona prompt, session store, demo FAQ
- `app/exp10/page.tsx` — chat UI (bubbles, typing indicator, suggestion chips)
