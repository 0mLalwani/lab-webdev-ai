"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp9 · AI Text Studio — talks to the Express API on :4009
   (OpenAI / Gemini via the server, or DEMO mode when no key is set). */

const API = `${apiBase("exp9")}/api`;

const MODES = [
  { id: "freeform", label: "Freeform", icon: "✍️", hint: "Anything you ask" },
  { id: "summarize", label: "Summarize", icon: "📝", hint: "Tight bullet points" },
  { id: "rewrite", label: "Rewrite", icon: "🪄", hint: "Clearer, polished" },
  { id: "brainstorm", label: "Brainstorm", icon: "💡", hint: "6–8 fresh ideas" },
  { id: "explain", label: "Explain", icon: "🎓", hint: "For a beginner" },
] as const;

type Mode = (typeof MODES)[number]["id"];

type Output = {
  text: string;
  provider: string;
  model: string;
  demo: boolean;
  mode: string;
};

type HistoryItem = Output & { prompt: string; at: number };

type Config = { provider: string; demo: boolean } | null;

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

const PRESETS = [
  "Summarize the water cycle for a 10-year-old",
  "Brainstorm names for a student club about ocean cleanup",
  "Rewrite: our team did the work quickly and it was good",
];

export default function Exp9Page() {
  const [config, setConfig] = React.useState<Config>(null);
  const [offline, setOffline] = React.useState(false);

  const [prompt, setPrompt] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("freeform");
  const [provider, setProvider] = React.useState("auto");
  const [maxTokens, setMaxTokens] = React.useState(400);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [output, setOutput] = React.useState<Output | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    fetch(`${API}/generate/config`)
      .then((res) => res.json())
      .then((json: Config) => setConfig(json))
      .catch(() => setOffline(true));
  }, []);

  async function generate() {
    if (prompt.trim().length < 4) {
      setError("Prompt must be at least 4 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), mode, provider, maxTokens }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          json.details ? Object.values(json.details).join(" · ") : json.error || "Request failed"
        );
      }
      setOutput(json);
      setHistory((prev) =>
        [{ ...json, prompt: prompt.trim(), at: Date.now() }, ...prev].slice(0, 8)
      );
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp9`.");
      } else {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard unavailable in this browser.");
    }
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
          exp9 · AI-powered text generation
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          AI Text Studio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          OpenAI &amp; Gemini integration via a server-side Express proxy —
          keys never reach the browser. Works immediately in{" "}
          <strong>demo mode</strong>; add a key to{" "}
          <code className="rounded bg-slate-100 px-1">.env</code> for real
          model output.
        </p>
      </header>

      {/* Status banners */}
      <div
        className={`mt-5 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium ${
          offline
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : config?.demo
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
        role="status"
      >
        <span
          className={`size-2 rounded-full ${
            offline ? "bg-rose-500" : config?.demo ? "bg-amber-500" : "bg-emerald-500"
          }`}
          aria-hidden="true"
        />
        {offline
          ? "API offline — start it with:  npm run server:exp9"
          : config?.demo
            ? `DEMO MODE — provider: ${config?.provider}. No key configured (see servers/exp9/README.md to add a free Gemini key).`
            : `Live · connected via ${config?.provider}`}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      {/* Mode chips */}
      <section className="mt-6" aria-label="Generation mode">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Mode
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              title={m.hint}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                mode === m.id
                  ? "bg-violet-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Composer */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prompt
          </span>
          <textarea
            className={`${inputCls} mt-2 h-36 resize-y leading-relaxed`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything — e.g. summarize an article, brainstorm project ideas, explain a concept…"
            maxLength={4000}
            aria-label="Prompt"
          />
        </label>
        <p className="mt-1 text-right text-[11px] text-slate-400">
          {prompt.length}/4000
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPrompt(preset)}
              className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50"
            >
              {preset.slice(0, 34)}…
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="block sm:w-56">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Provider
            </span>
            <select
              className={`mt-2 ${inputCls}`}
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              aria-label="AI provider"
            >
              <option value="auto">Auto (server default)</option>
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="demo">Demo (canned)</option>
            </select>
          </label>

          <label className="block flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Max length — {maxTokens} tokens
            </span>
            <input
              type="range"
              min={128}
              max={1024}
              step={64}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="mt-3 w-full accent-violet-600"
              aria-label="Max tokens"
            />
          </label>

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="shrink-0 rounded-full bg-violet-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate ✨"}
          </button>
        </div>
      </section>

      {/* Output */}
      {output && (
        <section className="mt-6 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Result · {output.mode} · {output.provider}
              <span className="ml-2 font-normal text-slate-400">{output.model}</span>
            </p>
            <button
              type="button"
              onClick={copyOutput}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          {output.demo && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700">
              🎬 Demo output — add an API key to .env for a real model response.
            </p>
          )}
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {output.text}
          </pre>
        </section>
      )}

      {!output && !busy && (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          Your generated text will appear here — pick a mode and hit{" "}
          <strong className="text-slate-500">Generate</strong>.
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Recent runs
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {history.map((item) => (
              <li key={item.at}>
                <button
                  type="button"
                  onClick={() => {
                    setPrompt(item.prompt);
                    setOutput(item);
                    setMode(item.mode as Mode);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-violet-300"
                >
                  <span className="shrink-0 text-xs">
                    {MODES.find((m) => m.id === item.mode)?.icon ?? "✨"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">
                      {item.prompt}
                    </span>
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
        exp9 · AI Text Generation — OpenAI / Gemini / demo (AI-assisted) ·{" "}
        <Link href="/" className="text-violet-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}

