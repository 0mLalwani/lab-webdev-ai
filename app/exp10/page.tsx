"use client";

import * as React from "react";
import Link from "next/link";

import { apiBase } from "@/lib/api";

/* exp10 · AI chatbot for the Bluepeak University website
   Backed by the Express chat API on :4010 (OpenAI/Gemini or demo mode). */

const API = `${apiBase("exp10")}/api`;

type Message = { role: "user" | "assistant"; text: string };

const WELCOME: Message = {
  role: "assistant",
  text: "Hi! 👋 I'm the Bluepeak University helpdesk assistant. Ask me about admissions, courses, fees, hostels, placements or campus life.",
};

const SUGGESTIONS = [
  "How do I apply for admission?",
  "What are the hostel facilities?",
  "Tell me about placement support",
  "Which courses are offered?",
];

/* Generate a fresh chat session id (called only from event handlers). */
function newSessionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `s-${Math.random().toString(36).slice(2, 10)}`;
}

export default function Exp10Page() {
  const [messages, setMessages] = React.useState<Message[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [offline, setOffline] = React.useState(false);
  const [config, setConfig] = React.useState<{ provider: string; demo: boolean } | null>(null);

  /* Session id is generated lazily on the first send (event handlers only). */
  const sessionRef = React.useRef<string>("");

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch(`${API}/chat/config`)
      .then((res) => res.json())
      .then((json) => setConfig(json))
      .catch(() => setOffline(true));
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    if (!sessionRef.current) sessionRef.current = newSessionId();

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: sessionRef.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.details ? Object.values(json.details).join(" · ") : json.error || "Request failed");
      }
      if (json.sessionId) sessionRef.current = json.sessionId;
      setMessages((prev) => [...prev, { role: "assistant", text: json.reply }]);
      setOffline(false);
    } catch (err) {
      if (err instanceof TypeError) {
        setOffline(true);
        setError("Cannot reach the API — run `npm run server:exp10`.");
      } else {
        setError(err instanceof Error ? err.message : "Message failed");
      }
      // Remove the optimistic user bubble on failure
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    await fetch(`${API}/chat/${sessionRef.current}`, { method: "DELETE" }).catch(
      () => undefined
    );
    sessionRef.current = newSessionId();
    setMessages([WELCOME]);
    setError(null);
  }

  const showSuggestions = messages.length <= 1 && !busy;

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-5 py-12 sm:px-8">
      <header>
        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          exp10 · AI chatbot · generative AI API
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Bluepeak University Helpdesk
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          A college-website chatbot powered by OpenAI/Gemini through an Express
          API with a persona system prompt and per-session memory.
        </p>
      </header>

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
          ? "API offline — start it with:  npm run server:exp10"
          : config?.demo
            ? "DEMO MODE — canned FAQ answers (admissions, fees, hostels…). Add a key in .env for real AI."
            : `Live · connected via ${config?.provider}`}
      </div>

      {/* Chat window */}
      <section
        className="mt-6 flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        aria-label="Chat"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-9 place-items-center rounded-full bg-sky-100 text-lg"
              aria-hidden="true"
            >
              🎓
            </span>
            <div>
              <p className="text-sm font-bold">Bluepeak Assistant</p>
              <p className="text-[11px] text-slate-400">
                typical reply time · instant
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Reset chat
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex min-h-[340px] flex-1 flex-col gap-3 overflow-y-auto bg-slate-50/70 p-5"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-sky-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3.5">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 border-t border-slate-100 px-5 py-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Type your question… (Enter to send)"
            aria-label="Message"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="shrink-0 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </section>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
        >
          {error}
        </p>
      )}

      <footer className="mt-10 border-t border-dashed border-slate-300 pt-5 text-xs text-slate-400">
        exp10 · AI Chatbot — Generative AI API · session memory · persona
        prompt ·{" "}
        <Link href="/" className="text-sky-600 hover:underline">
          all experiments
        </Link>
      </footer>
    </main>
  );
}

