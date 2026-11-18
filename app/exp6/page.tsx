"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp6 · Login / Registration UI backed by the Express auth server
   (npm run server:exp6 → http://localhost:4006). JWT is stored in
   localStorage and sent as `Authorization: Bearer <token>`. */

const API = `${apiBase("exp6")}/api`;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
};

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

export default function Exp6Page() {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [online, setOnline] = React.useState<boolean | null>(null);

  const [adminUsers, setAdminUsers] = React.useState<AuthUser[] | null>(null);
  const [adminError, setAdminError] = React.useState<string | null>(null);

  /* Restore session + health check on mount */
  React.useEffect(() => {
    const savedToken = window.localStorage.getItem("exp6_token");
    const savedUser = window.localStorage.getItem("exp6_user");
    if (savedToken && savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating persisted session from localStorage
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser) as AuthUser);
      } catch {
        /* ignore corrupt storage */
      }
    }
    fetch(`${API}/health`)
      .then((res) => setOnline(res.ok))
      .catch(() => setOnline(false));
  }, []);

  function validate() {
    const errors: Record<string, string> = {};
    if (mode === "register" && !form.name.trim())
      errors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim()))
      errors.email = "A valid email is required";
    if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setBusy(true);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const res = await fetch(`${API}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.details) setFieldErrors(json.details);
        throw new Error(json.message || json.error || "Request failed");
      }
      window.localStorage.setItem("exp6_token", json.token);
      window.localStorage.setItem("exp6_user", JSON.stringify(json.user));
      setToken(json.token);
      setUser(json.user);
      setFieldErrors({});
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Request failed — is the server running?"
      );
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("exp6_token");
    window.localStorage.removeItem("exp6_user");
    setToken(null);
    setUser(null);
    setAdminUsers(null);
  }

  /* Admin-only: GET /api/users with Bearer token */
  async function loadUsers() {
    setAdminError(null);
    try {
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      setAdminUsers(json.data);
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : "Failed to load users");
    }
  }

  async function deleteUser(id: string) {
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok || res.status === 404) await loadUsers();
    else if (res.status === 403) setAdminError("403 Forbidden — admin role required");
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
          exp6 · authentication & authorization
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {user ? "Secure area" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Express.js + MongoDB + bcrypt + JWT — registration, login and
          role-based authorization against{" "}
          <code className="rounded bg-slate-100 px-1">{apiBase("exp6")}</code>.
        </p>
      </header>

      <div
        className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          online === false
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
        role="status"
      >
        <span
          className={`size-2 rounded-full ${online === false ? "bg-rose-500" : "bg-emerald-500"}`}
          aria-hidden="true"
        />
        {online === false
          ? "API offline — start it with:  npm run server:exp6"
          : "API online — auth flow is live"}
      </div>

      {!user ? (
        /* ============ Auth forms ============ */
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-2" role="tablist" aria-label="Auth mode">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => {
                  setMode(tab);
                  setFieldErrors({});
                  setFormError(null);
                }}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  mode === tab
                    ? "bg-teal-600 text-white"
                    : "border border-slate-300 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-4">
            {mode === "register" && (
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name *
                </span>
                <input
                  className={`mt-1.5 ${inputCls} ${fieldErrors.name ? "!border-rose-400 !bg-rose-50" : ""}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <span className="mt-1 block text-xs font-medium text-rose-600">
                    {fieldErrors.name}
                  </span>
                )}
              </label>
            )}

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email *
              </span>
              <input
                type="email"
                className={`mt-1.5 ${inputCls} ${fieldErrors.email ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && (
                <span className="mt-1 block text-xs font-medium text-rose-600">
                  {fieldErrors.email}
                </span>
              )}
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password *{" "}
                <span className="normal-case text-slate-400">(min 8 chars)</span>
              </span>
              <input
                type="password"
                className={`mt-1.5 ${inputCls} ${fieldErrors.password ? "!border-rose-400 !bg-rose-50" : ""}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                aria-invalid={Boolean(fieldErrors.password)}
              />
              {fieldErrors.password && (
                <span className="mt-1 block text-xs font-medium text-rose-600">
                  {fieldErrors.password}
                </span>
              )}
            </label>

            {formError && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-[#0b2545] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123a6b] disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
            <p className="font-bold uppercase tracking-wider text-slate-400">
              Demo accounts
            </p>
            <p className="mt-1">
              admin@demo.dev / Admin123!{" "}
              <span className="text-teal-600">(admin)</span>
              <br />
              user@demo.dev / User12345!{" "}
              <span className="text-slate-400">(user)</span>
            </p>
          </div>
        </div>
      ) : (
        /* ============ Logged-in dashboard ============ */
        <div className="mt-6 flex flex-col gap-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  GET /api/auth/me — session
                </p>
                <h2 className="mt-2 text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  role: {user.role}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Log out
              </button>
            </div>
            <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              <summary className="cursor-pointer font-semibold">
                Raw JWT (localStorage)
              </summary>
              <code className="mt-2 block break-all">{token}</code>
            </details>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              GET /api/users — admin only (403 for regular users)
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={loadUsers}
                className="rounded-full bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                List users
              </button>
              {user.role !== "admin" && (
                <span className="text-xs text-slate-400">
                  (you&apos;ll get a 403 — try the admin account)
                </span>
              )}
            </div>

            {adminError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
              >
                {adminError}
              </p>
            )}

            {adminUsers && !adminError && (
              <ul className="mt-4 divide-y divide-slate-100">
                {adminUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {u.email} · {u.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteUser(u.id)}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp6 · auth — Express.js · MongoDB · JWT · bcrypt (AI-assisted) ·{" "}
        <Link href="/" className="text-teal-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}