import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are — the fictional team behind Bluepeak Studio.",
};

const VALUES = [
  { icon: "🧭", title: "Clarity first", text: "If a screen needs a manual, we've failed. We design for the first five seconds." },
  { icon: "🧪", title: "Evidence over opinion", text: "Decisions come from data, tests and user feedback — not the loudest voice." },
  { icon: "🌱", title: "Sustainable pace", text: "Calm teams ship better work. No heroics, no death marches." },
  { icon: "♿", title: "Accessible by default", text: "WCAG compliance isn't a phase at the end — it's how we build." },
];

const TEAM = [
  { name: "Maya Okafor", role: "Founder & Design Director", emoji: "🧑🏾‍🎨" },
  { name: "Jonas Weber", role: "Principal Engineer", emoji: "🧑🏼‍💻" },
  { name: "Aria Patel", role: "Product Strategist", emoji: "👩🏽‍🚀" },
  { name: "Leo Martins", role: "Motion & 3D", emoji: "🧑🏻‍🚀" },
];

export default function Exp4AboutPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
            About
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            A small studio with an unreasonable bias for quality.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Bluepeak Studio started in a coastal garage (yes, really) with two
            designers and a shared frustration: most agency sites say a lot and
            mean little. We wanted a studio that ships measurable outcomes —
            so that&apos;s what we built. This page is part of exp4, a
            multi-page website experiment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Our values</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {value.icon}
              </span>
              <h3 className="mt-3 font-bold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight">The team</h2>
          <p className="mt-2 text-sm text-slate-500">
            Placeholder people — this is a fictional studio after all.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-slate-200 p-5 text-center"
              >
                <span
                  className="mx-auto grid size-16 place-items-center rounded-full bg-slate-100 text-3xl"
                  aria-hidden="true"
                >
                  {member.emoji}
                </span>
                <h3 className="mt-3 text-sm font-bold">{member.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
