# exp8 · Student Management System

Database-driven student management app — **MongoDB + Express.js** (AI-assisted
code generation, debugging and optimization). UI lives at `/exp8`; the API runs
on **port 4008**.

```bash
npm run server:exp8     # just this API
npm run server:all      # all backend experiments (4005-4008)
```

- Health: `GET http://localhost:4008/api/health`
- Demo data: 6 students seeded on boot (idempotent — skips existing roll numbers)
- Database: `exp8_db` (in-memory MongoDB unless `MONGODB_URI` is set)

## Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/students` | List — `?search=&course=&page=&limit=&sort=` |
| GET | `/api/students/stats` | Total + per-course counts + average GPA (aggregation) |
| GET | `/api/students/:id` | Read one |
| POST | `/api/students` | Create (201) |
| PUT | `/api/students/:id` | Full update |
| PATCH | `/api/students/:id` | Partial update |
| DELETE | `/api/students/:id` | Delete (204) |

Student shape: `name`, `rollNo` (unique), `email` (unique), `course`
(`CSE|ECE|ME|CE`), `year` (1–5), `gpa` (0–10).

Error envelope: `400` validation (with per-field `details`), `404` not found,
`409` duplicate rollNo/email.

## AI-assisted debugging log

Issues caught during AI code review / live testing, and their fixes:

| # | Bug | Symptom | Fix |
| --- | --- | --- | --- |
| 1 | Mongoose `CastError` on malformed `:id` | Raw 500 stack trace instead of JSON | `lib/http.js` error middleware maps `CastError` → **400 Bad Request** |
| 2 | Duplicate `rollNo` insert | Unclear `E11000` crash | Unique indexes + middleware maps `code 11000` → **409 Conflict** with field names |
| 3 | Validator errors returned as array soup | UI couldn't show field messages | `ValidationError` normalised to `{ details: { field: message } }` |
| 4 | `GET /stats` registered after `GET /:id` | `/stats` matched `:id` → 400 CastError | Routes registered most-specific first (stats before `/:id`) |
| 5 | Leftover unused aggregation in stats | Duplicate DB round-trip | Removed; single `$group` pipeline + one `countDocuments` |
| 6 | Sort parameter passed straight to `.sort()` | Possible sort-key injection | Whitelist `SORTS` map (`gpa`, `-gpa`, `name`, …) |
| 7 | Seed loop re-inserted on every boot | Duplicate demo rows | Seeded only when `rollNo` not found (idempotent) |

## Optimizations applied

| Optimization | Why |
| --- | --- |
| **Unique indexes** on `rollNo`, `email` | O(log n) lookups + DB-enforced data integrity |
| **Compound index** `(course, gpa desc)` | Covers the UI's main filter+sort query — no in-memory sorting |
| **`.lean()`** on all reads | Returns plain objects, skips Mongoose document hydration overhead |
| **Pagination** (`page`, `limit` capped at 100) | Bounded response sizes — never loads the whole collection |
| **Filtered `countDocuments`** | Total matches the same filter as the page (not the full collection) |
| **Aggregation pipeline** for stats | Per-course counts + average GPA in one server round-trip |
| **Regex escaping** on search input | Prevents ReDoS-style accidental regex injection |

## Frontend

`app/exp8/page.tsx` — search, course filter, add/edit form, delete with
confirm, live stats cards, API online/offline indicator. Every button performs
a real HTTP request against the Express API.
