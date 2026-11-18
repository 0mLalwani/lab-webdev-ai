# Deployment Guide (Experiments 13 & 15)

Two platforms are involved because Vercel runs the **Next.js front end** but
does not run the long-lived Express servers in `servers/`.

```text
GitHub ──► Vercel   : Next.js UI (/exp1 … /exp12)
       └─► Render   : one API gateway (all Express experiments)
              └────► MongoDB Atlas (optional, persistent data)
```

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: AI-assisted web development experiments"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```


## 2. Deploy the APIs to Render (one service)

The gateway mounts every API under its own prefix (`/exp5` … `/exp12`).

| Setting | Value |
| --- | --- |
| Service type | Web Service |
| Repository | your GitHub repo |
| Build command | `npm install` |
| Start command | `npm run server:gateway` |
| Health check path | `/exp5/api/health` |

Environment variables:

```text
MONGODB_URI=...        # optional; blank = in-memory (resets on restart)
JWT_SECRET=...
OPENAI_API_KEY=...     # optional
GEMINI_API_KEY=...     # optional
AI_PROVIDER=           # openai | gemini | blank
```

Verify:

```text
https://<gateway>.onrender.com/                 → gateway status
https://<gateway>.onrender.com/exp5/api/health  → exp5
https://<gateway>.onrender.com/exp12/api/health → exp12
```

> The free Render tier sleeps after inactivity; the first request can take
> ~30–60 seconds. Open the gateway URL once before a demo.

## 3. Deploy the UI to Vercel

Import the same repository. Vercel auto-detects Next.js; keep the default
build settings (`npm run build`, output handled automatically).

Add these environment variables (Production **and** Preview):

```text
NEXT_PUBLIC_API_EXP5=https://<gateway>.onrender.com/exp5
NEXT_PUBLIC_API_EXP6=https://<gateway>.onrender.com/exp6
NEXT_PUBLIC_API_EXP7=https://<gateway>.onrender.com/exp7
NEXT_PUBLIC_API_EXP8=https://<gateway>.onrender.com/exp8
NEXT_PUBLIC_API_EXP9=https://<gateway>.onrender.com/exp9
NEXT_PUBLIC_API_EXP10=https://<gateway>.onrender.com/exp10
NEXT_PUBLIC_API_EXP11=https://<gateway>.onrender.com/exp11
NEXT_PUBLIC_API_EXP12=https://<gateway>.onrender.com/exp12
```

`NEXT_PUBLIC_*` values are baked in at build time — **redeploy after changing
them**. Locally the UI falls back to `localhost:4005`–`4012` automatically.

## 4. Persistent database (optional)

Create a free MongoDB Atlas cluster, add a database user and allow Render's
outbound IPs (or `0.0.0.0/0` for a course demo), then put the connection
string in Render's `MONGODB_URI`. Without it, exp5–exp8 use the in-memory
database and reset whenever the service restarts.

## 5. Smoke test after deploying

1. `https://<app>.vercel.app/exp1` — portfolio loads.
2. `/exp5` — create and delete a task (API + database path).
3. `/exp6` — log in as `admin@demo.dev / Admin123!`.
4. `/exp9` … `/exp12` — the badge shows OpenAI, Gemini or DEMO.
5. `/exp7/api-docs` is served by the gateway, not Vercel:
   `https://<gateway>.onrender.com/exp7/api-docs`.

## 6. Screenshots for the lab file

- `exp13-home.png` — production URL with the browser address bar visible.
- `exp13-dashboards.png` — Vercel deployment list + Render service + GitHub commits.
- `exp15-home.png` — public page and the authenticated dashboard.
- `exp15-dashboard.png` — content studio, chat, image gallery, admin students.

## Rollback

- **Vercel:** Deployments → select the previous build → *Promote to Production*.
- **Render:** Events/Deploys → previous deploy → *Redeploy*.
- **Code:** `git revert <sha>` and push; both platforms rebuild automatically.
