"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp7 · API documentation + live tester + Postman guide */

const BASE = apiBase("exp7");

const ENDPOINTS = [
  { method: "GET", path: "/api/products", desc: "List — filter, search, paginate, sort", tone: "bg-emerald-100 text-emerald-700" },
  { method: "GET", path: "/api/products/:id", desc: "Get one product", tone: "bg-emerald-100 text-emerald-700" },
  { method: "POST", path: "/api/products", desc: "Create — 201 + Location header", tone: "bg-amber-100 text-amber-700" },
  { method: "PUT", path: "/api/products/:id", desc: "Full replace", tone: "bg-sky-100 text-sky-700" },
  { method: "PATCH", path: "/api/products/:id", desc: "Partial update", tone: "bg-sky-100 text-sky-700" },
  { method: "DELETE", path: "/api/products/:id", desc: "Delete — 204 No Content", tone: "bg-rose-100 text-rose-700" },
  { method: "GET", path: "/api-docs/", desc: "Swagger UI (AI-generated OpenAPI)", tone: "bg-emerald-100 text-emerald-700" },
  { method: "GET", path: "/api/openapi.json", desc: "Raw OpenAPI 3.0 spec", tone: "bg-emerald-100 text-emerald-700" },
] as const;

const CURLS = [
  `curl ${BASE}/api/products?category=home&sort=price`,
  `curl ${BASE}/api/products?page=1&limit=5`,
  `curl -X POST ${BASE}/api/products -H "Content-Type: application/json" \\\n  -d '{"name":"New Gadget","category":"electronics","price":19.99}'`,
  `curl -X DELETE ${BASE}/api/products/<id>`,
];

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 font-mono";

export default function Exp7Page() {
  const [online, setOnline] = React.useState<boolean | null>(null);

  const [method, setMethod] = React.useState("GET");
  const [path, setPath] = React.useState("/api/products?limit=2");
  const [body, setBody] = React.useState(
    '{\n  "name": "New Gadget",\n  "category": "electronics",\n  "price": 19.99\n  , "quantity": 3\n}'
  );
  const [sending, setSending] = React.useState(false);
  const [response, setResponse] = React.useState<{
    status: number | string;
    text: string;
  } | null>(null);

  React.useEffect(() => {
    fetch(`${BASE}/api/health`)
      .then((res) => setOnline(res.ok))
      .catch(() => setOnline(false));
  }, []);

  async function send() {
    setSending(true);
    setResponse(null);
    try {
      const init: RequestInit = { method };
      if (method !== "GET" && method !== "DELETE") {
        init.headers = { "Content-Type": "application/json" };
        init.body = body;
      }
      const res = await fetch(`${BASE}${path}`, init);
      const text = (await res.text()).slice(0, 20000);
      setResponse({ status: res.status, text });
    } catch {
      setResponse({
        status: "ERR",
        text: `Could not reach ${BASE} — start it with:  npm run server:exp7`,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-4xl px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
          exp7 · REST API · Postman · docs
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Products REST API
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Express.js RESTful API on{" "}
          <code className="rounded bg-slate-100 px-1">{BASE}</code> —
          tested with Postman, documented with an AI-generated OpenAPI spec.
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
          ? "API offline — start it with:  npm run server:exp7"
          : `API online — Swagger UI at ${BASE}/api-docs`}
      </div>

      {/* Endpoint reference */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Endpoints</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {ENDPOINTS.map((ep) => (
              <li
                key={`${ep.method} ${ep.path}`}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <span
                  className={`w-16 shrink-0 rounded-md px-2 py-1 text-center text-[10px] font-bold uppercase ${ep.tone}`}
                >
                  {ep.method}
                </span>
                <code className="text-xs font-semibold text-slate-700">
                  {ep.path}
                </code>
                <span className="text-xs text-slate-400">{ep.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Curl examples */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">curl examples</h2>
        <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-[#0b2545] p-4">
          {CURLS.map((cmd) => (
            <pre
              key={cmd}
              className="overflow-x-auto text-[11px] leading-relaxed text-teal-200"
            >
              <code>{cmd}</code>
            </pre>
          ))}
        </div>
      </section>

      {/* Live tester */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Live tester</h2>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className={`${inputCls} sm:w-32`}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              aria-label="HTTP method"
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input
              className={inputCls}
              value={path}
              onChange={(e) => setPath(e.target.value)}
              aria-label="Request path"
            />
            <button
              type="button"
              onClick={send}
              disabled={sending}
              className="shrink-0 rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>

          {method !== "GET" && method !== "DELETE" && (
            <textarea
              className={`${inputCls} mt-3 h-32 resize-y`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-label="JSON request body"
              spellCheck={false}
            />
          )}

          {response && (
            <div className="mt-4">
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  typeof response.status === "number" && response.status < 400
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                Response · {response.status}
              </p>
              <pre className="mt-2 max-h-72 overflow-auto rounded-xl bg-[#0b2545] p-4 text-[11px] leading-relaxed text-teal-200">
                <code>{response.text}</code>
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* Swagger UI embed */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">AI-generated API documentation</h2>
        <p className="mt-1 text-xs text-slate-500">
          OpenAPI 3.0 spec served by swagger-ui-express — also available at{" "}
          <a
            href={`${BASE}/api-docs/`}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-violet-600 hover:underline"
          >
            {BASE}/api-docs
          </a>{" "}
          and as JSON at{" "}
          <a
            href={`${BASE}/api/openapi.json`}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-violet-600 hover:underline"
          >
            /api/openapi.json
          </a>
          .
        </p>
        <iframe
          title="Swagger UI"
          src={`${BASE}/api-docs/`}
          className="mt-3 h-[480px] w-full rounded-2xl border border-slate-200 bg-white"
        />
        {online === false && (
          <p className="mt-2 text-xs text-rose-500">
            Docs iframe is blank because the API server is offline.
          </p>
        )}
      </section>

      {/* Postman guide */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Test with Postman</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>
            Open Postman → <strong>Import</strong> → select{" "}
            <code className="rounded bg-slate-100 px-1">
              postman/exp7.postman_collection.json
            </code>
          </li>
          <li>
            Import{" "}
            <code className="rounded bg-slate-100 px-1">
              postman/exp7.environment.json
            </code>{" "}
            and select the <strong>exp7 · local</strong> environment
          </li>
          <li>
            Run <strong>1 · List products</strong>, copy a <code>_id</code> from
            the response into the <code>productId</code> variable
          </li>
          <li>
            Walk through requests 4–10 to exercise GET/POST/PUT/PATCH/DELETE +
            the 400/404 error envelopes
          </li>
        </ol>
      </section>

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp7 · RESTful API — Express.js · Postman · OpenAPI/Swagger
        (AI-generated) ·{" "}
        <Link href="/" className="text-violet-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}

