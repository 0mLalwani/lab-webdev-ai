import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Services and packages offered by Bluepeak Studio.",
};

const SERVICES = [
  { icon: "🎨", title: "Brand identity", text: "Logo systems, typography, colour and voice — a complete identity kit with usage guidelines.", price: "from $6k" },
  { icon: "🖥️", title: "Website design", text: "Marketing sites designed and built end-to-end, with CMS wiring and performance budgets.", price: "from $9k" },
  { icon: "📱", title: "Product UI/UX", text: "Research, flows, wireframes and polished interfaces for web and mobile products.", price: "from $12k" },
  { icon: "🧩", title: "Design systems", text: "Tokenised, documented component libraries that keep design and code perfectly in sync.", price: "from $14k" },
  { icon: "⚙️", title: "Frontend dev", text: "React/Next.js implementation with testing, accessibility and CI baked in.", price: "from $10k" },
  { icon: "🔍", title: "SEO & analytics", text: "Audits, structured data, Core Web Vitals work and dashboards that show what matters.", price: "from $4k" },
];

const PACKAGES = [
  {
    name: "Launch",
    price: "$9,500",
    period: "one-off",
    features: ["Up to 6 pages", "Custom design", "2 revision rounds", "Basic SEO setup", "2-week delivery"],
    featured: false,
  },
  {
    name: "Scale",
    price: "$18,000",
    period: "one-off",
    features: ["Up to 14 pages", "Design system starter", "CMS integration", "Analytics + SEO", "4-week delivery"],
    featured: true,
  },
  {
    name: "Partner",
    price: "$5,200",
    period: "/month",
    features: ["Dedicated squad", "Unlimited requests", "Weekly releases", "Priority support", "Rolling contract"],
    featured: false,
  },
];

export default function Exp4ServicesPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
            Services
          </span>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Everything between an idea and a launched product.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Pick a standalone service or combine them into a package — every
            engagement includes responsive layouts, accessibility checks and
            handover documentation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {service.icon}
              </span>
              <h2 className="mt-3 font-bold">{service.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {service.text}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-teal-600">
                {service.price}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Packages</h2>
          <p className="mt-2 text-sm text-slate-500">
            Transparent pricing for common scopes.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  pkg.featured
                    ? "border-teal-500 shadow-lg shadow-teal-500/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{pkg.name}</h3>
                  {pkg.featured && (
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-3 text-3xl font-bold">
                  {pkg.price}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    {pkg.period}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-teal-600" aria-hidden="true">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/exp4/contact"
                  className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                    pkg.featured
                      ? "bg-[#0b2545] text-white hover:bg-[#123a6b]"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Get started
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
