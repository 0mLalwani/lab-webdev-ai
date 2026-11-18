"use client";

import * as React from "react";

import {
  hasErrors,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "../_lib/validation";

const SUBJECTS = ["New project", "Collaboration", "Support", "Other"];

const EMPTY: ContactValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};



function fieldClass(error?: string) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
    error
      ? "border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
      : "border-slate-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
  }`;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [values, setValues] = React.useState<ContactValues>(EMPTY);
  const [errors, setErrors] = React.useState<ContactErrors>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [sent, setSent] = React.useState(false);

  const handleChange =
    (field: keyof ContactValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      if (touched[field]) setErrors(validateContact(next));
    };

  const handleBlur = (field: keyof ContactValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateContact(values));
  };

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    setTouched({
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
    });
    if (!hasErrors(errs)) {
      // Demo only — no backend. Wire this to your API.
      setSent(true);
    }
  }

  function onReset() {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setSent(false);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-relaxed text-emerald-900"
      >
        <p className="text-base font-bold">✅ Message sent!</p>
        <p className="mt-1">
          Thanks {values.name.trim().split(" ")[0]} — we&apos;ll reply to{" "}
          <strong>{values.email}</strong> within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Name *
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby="err-name"
            placeholder="Ada Lovelace"
            className={`mt-1.5 ${fieldClass(errors.name)}`}
          />
          <ErrorText id="err-name" message={errors.name} />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email *
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="err-email"
            placeholder="you@example.com"
            className={`mt-1.5 ${fieldClass(errors.email)}`}
          />
          <ErrorText id="err-email" message={errors.email} />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Phone <span className="normal-case text-slate-400">(optional)</span>
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            onBlur={handleBlur("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby="err-phone"
            placeholder="+1 555 010 2030"
            className={`mt-1.5 ${fieldClass(errors.phone)}`}
          />
          <ErrorText id="err-phone" message={errors.phone} />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Subject *
          </span>
          <select
            name="subject"
            value={values.subject}
            onChange={handleChange("subject")}
            onBlur={handleBlur("subject")}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby="err-subject"
            className={`mt-1.5 ${fieldClass(errors.subject)}`}
          >
            <option value="">Choose a subject…</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <ErrorText id="err-subject" message={errors.subject} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Message *{" "}
          <span className="normal-case text-slate-400">
            ({values.message.trim().length}/10 min)
          </span>
        </span>
        <textarea
          name="message"
          rows={6}
          value={values.message}
          onChange={handleChange("message")}
          onBlur={handleBlur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby="err-message"
          placeholder="Tell us about your project, timeline and budget…"
          className={`mt-1.5 resize-y ${fieldClass(errors.message)}`}
        />
        <ErrorText id="err-message" message={errors.message} />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-[#0b2545] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123a6b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          Send message
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Reset
        </button>
        <span className="text-xs text-slate-400">* required fields</span>
      </div>
    </form>
  );
}

