"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp11 · AI Content Generator — blogs, emails & social posts */

const API = `${apiBase("exp11")}/api`;

const TYPES = [
  { id: "blog", icon: "📝", label: "Blog post", hint: "Title + sections + CTA" },
  { id: "email", icon: "📧", label: "Email", hint: "Subject + body" },
  { id: "instagram", icon: "📸", label: "Instagram", hint: "Caption + hashtags" },
  { id: "x", icon: "🐦", label: "X thread", hint: "Numbered, ≤280/tweet" },
  { id: "linkedin", icon: "💼", label: "LinkedIn", hint: "Hook + insights" },
] as const;

const TONES = ["professional", "casual", "friendly", "witty", "persuasive"];
const LENGTHS = ["short", "medium", "long"] as const;

const EXAMPLES = [
  "The rise of remote learning in 2026",
  "Announcing our new ocean-cleanup feature",
  "Tips for first-time developers",
];

type Output = {
  text: string;
  provider: string;
  model: string;
  demo: boolean;
  type: string;
};

type HistoryItem = Output & { topic: string; tone: string; at: number };

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export default function Exp11Page() {
  const [demo, setDemo] = React.useState<boolean | null>(null);
  const [offline, setOffline] = React.useState(false);

  const [type, setType] = React.useState<(typeof TYPES)[number]["id"]>("blog");
  const [topic, setTopic] = React.useState("");
  const [keyPoints, setKeyPoints] = React.useState("");
  const [tone, setTone] = React.useState("professional");
  const [length, setLength] = React.useState<(typeof LENGTHS)[number]>("medium");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<Output | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    fetch(`${API}/content/config`)
      .then((res) => res.json())
      .then((json) => setDemo(Boolean(json.demo)))
      .catch(() => setOffline(true));
  }, []);

  async function generate() {
    if (topic.trim().length < 3) {
      setError("Topic must be at least 3 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch(`${API}/content/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic: topic.trim(), tone, length, keyPoints: keyPoints.trim() || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(json.details ? Object.values(json.details).join(" · ") : json.error || "Request failed");
      setOutput(json);
      setHistory((prev) =>
        [{ ...json, topic: topic.trim(), tone, at: Date.now() }, ...prev].slice(0, 6)
      );
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp11`.");
      } else {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard unavailable in this browser.");
    }
  }

  function download() {
    if (!output) return;
    const blob = new Blob([output.text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.type}-${topic.trim().slice(0, 24).replace(/\s+/g, "-").toLowerCase() || "content"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
          exp11 · AI content generation
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Content Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Blog posts, emails and social media captions from one form —
          OpenAI/Gemini through a server-side proxy, with a full-featured demo
          mode when no key is set.
        </p>
      </header>

      <div
        className={`mt-5 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          offline
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : demo
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
        role="status"
      >
        <span
          className={`size-2 rounded-full ${
            offline ? "bg-rose-500" : demo ? "bg-amber-500" : "bg-emerald-500"
          }`}
          aria-hidden="true"
        />
        {offline
          ? "API offline — start it with:  npm run server:exp11"
          : demo
            ? "DEMO MODE — structured templates returned. Add a free Gemini key in .env for real AI."
            : "Live · AI generation enabled"}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      {/* Content type cards */}
      <section
        className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5"
        aria-label="Content type"
      >
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              type === t.id
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {t.icon}
            </span>
            <p className="mt-2 text-sm font-bold">{t.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{t.hint}</p>
          </button>
        ))}
      </section>

      {/* Form */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Topic *
          </span>
          <input
            className={`mt-2 ${inputCls}`}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What is the content about?"
            maxLength={1000}
            aria-label="Topic"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setTopic(ex)}
              className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50"
            >
              {ex}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key points{" "}
            <span className="normal-case text-slate-300">(optional)</span>
          </span>
          <textarea
            className={`${inputCls} mt-2 h-20 resize-y`}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="Must-mention points, one per line…"
            aria-label="Key points"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-end gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tone
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    tone === t
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Length
            </p>
            <div className="mt-2 flex gap-1.5">
              {LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    length === l
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="ml-auto rounded-full bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "Writing…" : "Generate ✨"}
          </button>
        </div>
      </section>

      {/* Output */}
      {output && (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {TYPES.find((t) => t.id === output.type)?.icon}{" "}
              {TYPES.find((t) => t.id === output.type)?.label ?? output.type} ·{" "}
              {output.provider}
              <span className="ml-2 font-normal text-slate-400">{output.model}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <button
                type="button"
                onClick={download}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Download .md
              </button>
            </div>
          </div>
          {output.demo && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700">
              🎬 Demo output — add an API key to .env for a real model write-up.
            </p>
          )}
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {output.text}
          </pre>
        </section>
      )}

      {!output && !busy && (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          Your generated content will appear here.
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Recent generations
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {history.map((item) => (
              <li key={item.at}>
                <button
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setType(item.type as (typeof TYPES)[number]["id"]);
                    setTone(item.tone);
                    setOutput(item);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-emerald-300"
                >
                  <span className="text-sm">
                    {TYPES.find((t) => t.id === item.type)?.icon ?? "📄"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{item.topic}</span>
                    <span className="block truncate text-[11px] text-slate-400">
                      {item.text.replace(/\s+/g, " ").slice(0, 90)}…
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-300">
                    {new Date(item.at).toLocaleTimeString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-12 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp11 · AI Content Generator — blogs · emails · social (AI-assisted) ·{" "}
        <Link href="/" className="text-emerald-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}


