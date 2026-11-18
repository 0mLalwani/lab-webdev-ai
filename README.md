# JU Web Dev AI — Experiments 1–15

A single Next.js project containing fifteen AI-assisted web development
experiments, from a responsive portfolio to a deployed full-stack AI
application. Front-end experiments run entirely in the browser; backend
experiments pair a React UI with an Express.js API, MongoDB, JWT auth and
Generative AI providers.

- **UI:** <http://localhost:3000>
- **APIs:** ports `4005`–`4012` (or one gateway on `4100`)
- **AI keys:** optional — without them, experiments 9–12 run in demo mode

---

## Contents

| # | Experiment | Route | Backend | Command |
| --- | --- | --- | --- | --- |
| 1 | Responsive personal portfolio | `/exp1` | — | `npm run dev` |
| 2 | Startup landing page (Bootstrap 5) | `/exp2` | — | `npm run dev` |
| 3 | Interactive DOM lab (vanilla JS) | `/exp3` | — | `npm run dev` |
| 4 | Multi-page site with forms & validation | `/exp4` | — | `npm run dev` |
| 5 | CRUD app (Node + Express + MongoDB) | `/exp5` | `:4005` | `npm run server:exp5` |
| 6 | Authentication & authorization (JWT) | `/exp6` | `:4006` | `npm run server:exp6` |
| 7 | REST API + Swagger + Postman | `/exp7` | `:4007` | `npm run server:exp7` |
| 8 | Student Management System | `/exp8` | `:4008` | `npm run server:exp8` |
| 9 | AI text generation (OpenAI / Gemini) | `/exp9` | `:4009` | `npm run server:exp9` |
| 10 | AI helpdesk chatbot | `/exp10` | `:4010` | `npm run server:exp10` |
| 11 | AI content generator | `/exp11` | `:4011` | `npm run server:exp11` |
| 12 | AI image generation & captioning | `/exp12` | `:4012` | `npm run server:exp12` |
| 13 | Deployment & version control | — | — | see [DEPLOYMENT.md](./DEPLOYMENT.md) |
| 14 | Testing, debugging, performance & security | — | all | `npm test` |
| 15 | Full-stack AI capstone | all | all | `npm run server:all` |

The fastest way to run everything:

```bash
npm install
cp .env.example .env     # first time only — do not overwrite an existing .env
npm run server:all       # terminals 1
npm run dev              # terminal 2
```

Then open <http://localhost:3000> and pick an experiment.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Bootstrap 5 (exp2), shadcn/ui + Radix (exp1/4) |
| APIs | Node.js, Express.js 5, CORS |
| Database | MongoDB + Mongoose 9; `mongodb-memory-server` fallback |
| Auth | bcryptjs, JSON Web Tokens |
| AI | OpenAI Chat Completions, Gemini Generative Language API, Pollinations |
| Docs | OpenAPI 3.0 + Swagger UI, Postman collection |
| Tests | Node built-in `node:test` runner |
| Deploy | Vercel (UI) + Render (APIs) + MongoDB Atlas (optional) |

---

## Prerequisites

- **Node.js 22+** (the tests import TypeScript directly using Node's type stripping)
- npm 10+
- No local MongoDB needed — the servers start an in-memory instance automatically
- Optional: a free [Gemini API key](https://aistudio.google.com/apikey) or [OpenAI key](https://platform.openai.com/api-keys)

---

## Configuration

Copy the template and fill in only what you need (skip this if `.env`
already exists — do not overwrite a file that contains real keys):

```bash
cp .env.example .env
```

| Variable | Purpose | Required? |
| --- | --- | --- |
| `MONGODB_URI` | Persistent MongoDB (local or Atlas) | No — in-memory fallback |
| `JWT_SECRET` | Signs exp6 tokens | Recommended |
| `OPENAI_API_KEY` | exp9–exp12 OpenAI provider | No — demo mode |
| `GEMINI_API_KEY` | exp9–exp12 Gemini provider, exp12 captioning | No — demo mode |
| `AI_PROVIDER` | Prefer `openai` or `gemini` | No |
| `OPENAI_MODEL` / `GEMINI_MODEL` | Model overrides (`gemini-4-hydrogen` by default) | No |
| `GEMINI_THINKING_LEVEL` | `low` (default), `medium`, `high`, `xhigh` | No |
| `GEMINI_FALLBACK_MODELS` | Retried when the primary model is rate-limited (`gemini-3.1-flash-lite` by default) | No |
| `EXP5_PORT` … `EXP12_PORT` | Local port overrides | No |
| `NEXT_PUBLIC_API_EXP5` … `12` | Production API origins for Vercel | Only when deployed |

Without any AI key, experiments 9–12 return deterministic demo output, so
the whole project remains demonstrable offline.

> **Gemini free tier:** `gemini-4-hydrogen` is the newest model and always
> reasons before answering, so thinking tokens count against the output
> budget. The app sends `GEMINI_THINKING_LEVEL=low` and adds 2 048 tokens of
> headroom automatically. The free tier allows **20 requests/day** for this
> model; when that runs out the server retries `GEMINI_FALLBACK_MODELS`
> (verified working with `gemini-3.1-flash-lite`) so demos keep going.

---

## Running the Project

### 1. Front end

```bash
npm run dev
```

All experiment pages are served from <http://localhost:3000>. The root page
`/` is the experiment index.

### 2. Backends — one at a time

```bash
npm run server:exp5    # :4005
npm run server:exp6    # :4006
npm run server:exp7    # :4007
npm run server:exp8    # :4008
npm run server:exp9    # :4009
npm run server:exp10   # :4010
npm run server:exp11   # :4011
npm run server:exp12   # :4012
```

Each server prints its URL and seeds demo data on boot.

### 3. Backends — all at once

```bash
npm run server:all
```

Starts every API on its port with one shared in-memory MongoDB. This is the
recommended setup for a demo or viva.

### 4. Backends — single gateway (deployment mode)

```bash
npm run server:gateway   # :4100
```

Mounts all eight APIs under one origin: `/exp5/api/...` … `/exp12/api/...`.
Useful for hosting on a single Render web service. See
[DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Experiment Guide

### Experiment 1 — Responsive Personal Portfolio

**Run:** `npm run dev` → <http://localhost:3000/exp1>

A dark blue-sky parallax portfolio with a collapsible sidebar, glass panels,
project grid, about section and contact form.

**Try:** collapse/expand the sidebar, scroll to see the parallax layers,
resize to mobile, submit the contact form.

---

### Experiment 2 — Startup Landing Page (Bootstrap 5)

**Run:** `npm run dev` → <http://localhost:3000/exp2>

A "Nebula" analytics landing page built with Bootstrap 5: sticky navbar,
gradient hero, feature grid, pricing tiers and testimonial carousel.

**Try:** resize below 992 px to use the hamburger menu, run the carousel,
compare pricing cards at desktop and mobile widths.

---

### Experiment 3 — Interactive DOM Lab

**Run:** `npm run dev` → <http://localhost:3000/exp3>

Every widget uses plain JavaScript DOM APIs — no React state: clock, theme
toggle, project filter, live search, counter, progress bar, modal,
accordion, form validation and scroll reveal.

**Try:** filter projects, search as you type, switch to dark mode, open the
modal with the keyboard, scroll to trigger reveals.

---

### Experiment 4 — Multi-Page Website with Forms

**Run:** `npm run dev` → <http://localhost:3000/exp4>

A four-page studio site with shared navigation, footer and validated forms.

Pages:

- `/exp4` — Home
- `/exp4/about` — About
- `/exp4/services` — Services
- `/exp4/contact` — Contact form

**Try:** submit the contact form empty, enter a malformed email, then a valid
submission. Use the footer newsletter form. Navigate between pages and watch
the active link.

---

### Experiment 5 — CRUD Application (Express + MongoDB)

**Run:**

```bash
npm run server:exp5
npm run dev
```

Open <http://localhost:3000/exp5>.

**Try:** create a task, edit it, toggle it done, search for it, filter by
status and delete it. Every action is a real HTTP request to `:4005`.

---

### Experiment 6 — Authentication & Authorization

**Run:**

```bash
npm run server:exp6
npm run dev
```

Open <http://localhost:3000/exp6>.

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@demo.dev` | `Admin123!` |
| User | `user@demo.dev` | `User12345!` |

**Try:** register a new account, log in, open the profile panel, then log in
as the admin and open the user-management table. A normal user receives
`403` on admin routes.

---

### Experiment 7 — REST API, Swagger & Postman

**Run:**

```bash
npm run server:exp7
npm run dev
```

Open <http://localhost:3000/exp7>.

- Swagger UI: <http://localhost:4007/api-docs>
- Raw OpenAPI JSON: <http://localhost:4007/api/openapi.json>

**Try:** use the built-in tester on `/exp7`, execute requests in Swagger, or
import the Postman files:

```text
postman/exp7.postman_collection.json
postman/exp7.environment.json
```

Run the collection top to bottom. The create request sets `productId` for the
later update and delete requests.

---

### Experiment 8 — Student Management System

**Run:**

```bash
npm run server:exp8
npm run dev
```

Open <http://localhost:3000/exp8>.

**Try:** view the stat cards, search by name or roll number, filter by course,
sort by GPA, create a student, then trigger a duplicate roll number to see
the `409` response.

---

### Experiment 9 — AI Text Generation

**Run:**

```bash
npm run server:exp9
npm run dev
```

Open <http://localhost:3000/exp9>.

Modes: freeform, summarize, rewrite, brainstorm, explain.

**Try:** generate in two modes, adjust the token slider, copy the result,
check the provider badge. Without a key the badge shows **DEMO** and still
returns useful text.

---

### Experiment 10 — AI Helpdesk Chatbot

**Run:**

```bash
npm run server:exp10
npm run dev
```

Open <http://localhost:3000/exp10>.

**Try:** ask about admissions, then a follow-up about hostels to test session
memory. Use a suggestion chip. Reset the conversation from the UI.

---

### Experiment 11 — AI Content Generator

**Run:**

```bash
npm run server:exp11
npm run dev
```

Open <http://localhost:3000/exp11>.

Types: blog, email, Instagram, X thread, LinkedIn.

**Try:** generate the same topic as an email and a LinkedIn post, change tone
and length, copy and download the result.

---

### Experiment 12 — AI Image Generation & Captioning

**Run:**

```bash
npm run server:exp12
npm run dev
```

Open <http://localhost:3000/exp12>.

Image generation works **with no key** via Pollinations. Captioning requires
`GEMINI_API_KEY`.

**Try:** pick a style and aspect ratio, reuse a seed, enhance a short prompt,
then upload an image in the Caption tab (if Gemini is configured).

---

### Experiment 13 — Deployment & Version Control

No local route. Follow [DEPLOYMENT.md](./DEPLOYMENT.md):

1. Push the repo to GitHub.
2. Deploy `npm run server:gateway` to a Render web service.
3. Deploy the Next.js app to Vercel.
4. Set `NEXT_PUBLIC_API_EXP5…12` on Vercel to the gateway URLs.
5. Redeploy and smoke-test.

---

### Experiment 14 — Testing, Debugging, Performance & Security

**Unit tests** (always run):

```bash
npm test
```

**API integration tests** (require the servers):

```bash
npm run server:all    # terminal 1
npm test              # terminal 2
```

Expected: **26 tests, 26 passing** when every API is up; the 17 integration
tests skip automatically when a server is not running.

Also useful:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual performance and security checks are documented in the lab record.

---

### Experiment 15 — Full-Stack AI Capstone

**Run everything:**

```bash
npm run server:all
npm run dev
```

Then walk the integrated flow:

1. Public pages — `/exp1` … `/exp4`
2. Auth — `/exp6`
3. AI tools — `/exp9`, `/exp10`, `/exp11`, `/exp12`
4. Database module — `/exp8`
5. API documentation — `/exp7`

The capstone composes the earlier experiments into one product with a shared
navigation, authentication, database, AI features and cloud deployment.

---

## Testing

```bash
npm test                 # unit + integration (integration skips if APIs are down)
npm run lint             # ESLint
npx tsc --noEmit         # type check
npm run build            # production build
```

Test files:

- `tests/validation.test.mjs` — exp4 validation (9 tests)
- `tests/api.test.mjs` — exp5–exp12 API behaviour (17 tests)

---

## Project Structure

```text
app/
  page.tsx               experiment index
  exp1 … exp12/          one route per experiment
  exp4/                  nested multi-page site
  globals.css            Tailwind + design tokens
servers/
  exp5 … exp12/          Express apps (model, routes, index)
  lib/                   shared db, http, ai and security helpers
  gateway.js             single-origin API gateway
  start-all.js           local multi-port runner
lib/
  api.ts                 API origin resolution (localhost ↔ NEXT_PUBLIC_API_*)
components/ui/           shadcn/ui primitives
tests/                   node:test unit and API suites
postman/                 exp7 collection and environment
```

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Page says "API offline" | Start the matching server (`npm run server:exp5`, or `server:all`). |
| `EADDRINUSE` | Another server is already running; stop it or change `EXP*_PORT`. |
| First API request is slow | The in-memory MongoDB downloads/boots once; subsequent starts are faster. |
| AI panel shows demo output | No key is configured, or `AI_PROVIDER` points at a provider without a key. |
| AI reply is empty | Gemini spent the whole output budget thinking. Keep `GEMINI_THINKING_LEVEL=low` (the server already adds 2 048 tokens of headroom) and avoid tiny `maxTokens` values. |
| AI request returns `429` | Gemini's free daily quota is used up (20/day for `gemini-4-hydrogen`, resets midnight Pacific). `GEMINI_FALLBACK_MODELS` takes over automatically, or use demo mode. |
| AI request returns `502`/`503` | The provider rejected the key/model, or the model is overloaded. Check `GEMINI_MODEL` / `OPENAI_MODEL` and the message shown in the panel. |
| Env changes have no effect | Restart the API server. `NEXT_PUBLIC_*` changes also need a Vercel redeploy. |
| Integration tests all skip | They require `npm run server:all` to be running. |
| Deployed UI still calls localhost | `NEXT_PUBLIC_API_EXP*` variables were missing at build time; add them and redeploy. |
| Render service takes ~1 minute | Free tier cold start; open the gateway URL before demonstrating. |

---

## Notes

- Full source code lives in this repository for demonstration and viva; the
  lab record contains architecture, prompts and screenshots only.
- `.env` is git-ignored. Never commit real API keys.
- Experiments 9–12 are fully usable without billing thanks to demo mode and
  the keyless Pollinations image API.
