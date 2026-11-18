import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "../_components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — validated contact form and studio details.",
};

const DETAILS = [
  { icon: Mail, label: "Email", value: "hello@bluepeak.studio", href: "mailto:hello@bluepeak.studio" },
  { icon: Phone, label: "Phone", value: "+1 555 010 2030", href: "tel:+15550102030" },
  { icon: MapPin, label: "Studio", value: "Pier 9, Harbour District", href: undefined },
];

const FAQ = [
  {
    q: "How fast can you start?",
    a: "Most projects kick off within 1–2 weeks of signing.",
  },
  {
    q: "Do you work with startups?",
    a: "Yes — the Launch package was designed specifically for early-stage teams.",
  },
  {
    q: "Is this form connected to a backend?",
    a: "No — it's client-side validation only, as required for the exp4 experiment.",
  },
];

export default function Exp4ContactPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
            Contact
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Tell us what you&apos;re building.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            The form below validates as you type and on submit — required
            fields, email format, phone pattern and message length.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold">Send a message</h2>
            <p className="mt-1 text-xs text-slate-500">
              All fields marked * are validated.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Details + FAQ */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Direct details</h2>
              <ul className="mt-4 space-y-4">
                {DETAILS.map((detail) => {
                  const Icon = detail.icon;
                  const body = (
                    <>
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-600">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          {detail.label}
                        </span>
                        <span className="block truncate text-sm font-medium">
                          {detail.value}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={detail.label}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 p-2">
                          {body}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">FAQ</h2>
              <dl className="mt-4 space-y-4">
                {FAQ.map((item) => (
                  <div key={item.q}>
                    <dt className="text-sm font-semibold">{item.q}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-slate-600">
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
