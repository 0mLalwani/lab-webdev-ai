import Link from "next/link";

const PREVIEW = [
  {
    icon: "🎨",
    title: "Brand & UI design",
    text: "Identity systems, design languages and component libraries your team will enjoy using.",
  },
  {
    icon: "⚙️",
    title: "Web engineering",
    text: "Fast, accessible sites and apps built with modern tooling — from landing pages to products.",
  },
  {
    icon: "📈",
    title: "Growth & SEO",
    text: "Technical SEO, analytics and iteration loops that turn traffic into measurable pipeline.",
  },
];

const PROCESS = [
  { step: "01", title: "Discover", text: "Workshops, audits and user interviews to find the real problem." },
  { step: "02", title: "Design", text: "Rapid prototypes, design systems and weekly review loops." },
  { step: "03", title: "Build", text: "Component-driven development with CI, tests and perf budgets." },
  { step: "04", title: "Evolve", text: "Measure, learn and iterate — the launch is the starting line." },
];

export default function Exp4HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0b2545] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              exp4 · multi-page site
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              We build digital products with{" "}
              <span className="text-teal-300">blue-chip</span> craft.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
              Bluepeak Studio is a fictional agency demo — navigation menu,
              four responsive pages, validated forms, all AI-assisted. Poke
              around!
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/exp4/contact"
                className="rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-[#0b2545] transition hover:bg-teal-300"
              >
                Start a project
              </Link>
              <Link
                href="/exp4/services"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View services
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["120+", "projects shipped"],
              ["14 yrs", "avg. experience"],
              ["4.9/5", "client rating"],
              ["6 wks", "typical launch"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-2xl font-bold text-teal-300">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service previews */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What we do
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Three pillars, one team — details on the{" "}
          <Link
            href="/exp4/services"
            className="font-semibold text-teal-600 hover:underline"
          >
            services page
          </Link>
          .
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PREVIEW.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="mt-3 font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight">How we work</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
                  {item.step}
                </span>
                <h3 className="mt-2 font-bold">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0b2545] to-teal-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Got something to build?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-teal-50/90">
            Fill in a short form with validation — it takes about a minute.
          </p>
          <Link
            href="/exp4/contact"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b2545] transition hover:bg-teal-50"
          >
            Get in touch →
          </Link>
        </div>
      </section>
    </>
  );
}

