"use client";

import * as React from "react";

import { validateEmail } from "../_lib/validation";

/** Compact newsletter signup used in the exp4 footer. */
export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (!message) setDone(true);
  }

  if (done) {
    return (
      <p
        role="status"
        className="mt-3 rounded-lg border border-teal-400/30 bg-teal-400/10 px-3 py-2 text-xs text-teal-200"
      >
        🎉 You&apos;re subscribed — welcome aboard!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-3">
      <div className="flex gap-2">
        <input
          type="email"
          name="newsletter-email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby="err-newsletter"
          placeholder="you@example.com"
          className={`w-full min-w-0 rounded-lg border bg-white/10 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 ${
            error
              ? "border-rose-400 focus:ring-2 focus:ring-rose-500/30"
              : "border-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30"
          }`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-[#0b2545] transition hover:bg-teal-300"
        >
          Join
        </button>
      </div>
      {error && (
        <p
          id="err-newsletter"
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-400"
        >
          {error}
        </p>
      )}
    </form>
  );
}
