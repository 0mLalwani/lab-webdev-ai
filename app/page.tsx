import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";

type Experiment = {
  slug: string;
  href?: string;
  title: string;
  name: string;
  description: string;
  tags: string[];
  status: "Live" | "Coming soon";
};

const experiments: Experiment[] = [
  {
    slug: "exp1",
    href: "/exp1",
    title: "exp1",
    name: "Ocean Portfolio",
    description:
      "Responsive personal portfolio — dark blue-sky parallax background with drifting clouds, glassy white UI, mono type and an expandable sidebar. No navbar.",
    tags: ["Next.js", "Tailwind", "shadcn/ui"],
    status: "Live",
  },
  {
    slug: "exp2",
    href: "/exp2",
    title: "exp2",
    name: "Startup Landing",
    description:
      "Responsive startup landing page — navbar, hero, features, pricing and testimonial carousel built with Bootstrap 5.",
    tags: ["Bootstrap 5", "AI-assisted UI"],
    status: "Live",
  },
  {
    slug: "exp3",
    href: "/exp3",
    title: "exp3",
    name: "Interactive DOM Lab",
    description:
      "Vanilla JavaScript playground — filter/sort/search, modal, toasts, theme toggle and counters via pure DOM manipulation.",
    tags: ["JavaScript", "DOM APIs"],
    status: "Live",
  },
  {
    slug: "exp4",
    href: "/exp4",
    title: "exp4",
    name: "Bluepeak Studio",
    description:
      "Multi-page website with responsive nav menu, 4 routes, forms and full client-side validation.",
    tags: ["Multi-page", "Forms + validation"],
    status: "Live",
  },
  {
    slug: "exp5",
    href: "/exp5",
    title: "exp5",
    name: "Task CRUD App",
    description:
      "CRUD-based web application — React UI against a real Node.js + Express + MongoDB API on port 4005 (npm run server:all).",
    tags: ["Node.js", "Express", "MongoDB"],
    status: "Live",
  },
  {
    slug: "exp6",
    href: "/exp6",
    title: "exp6",
    name: "Auth & Roles",
    description:
      "Registration, login, JWT sessions and role-based authorization (admin/user) with bcrypt-hashed passwords.",
    tags: ["JWT", "bcrypt", "RBAC"],
    status: "Live",
  },
  {
    slug: "exp7",
    href: "/exp7",
    title: "exp7",
    name: "REST API + Docs",
    description:
      "Products REST API with Postman collection, live tester and AI-generated OpenAPI/Swagger documentation.",
    tags: ["REST", "Postman", "OpenAPI"],
    status: "Live",
  },
  {
    slug: "exp8",
    href: "/exp8",
    title: "exp8",
    name: "Student Management",
    description:
      "Database-driven Student Management System — MongoDB + Express.js with aggregate stats, indexed queries and an AI-assisted debugging log.",
    tags: ["MongoDB", "Express", "Optimized"],
    status: "Live",
  },
  {
    slug: "exp9",
    href: "/exp9",
    title: "exp9",
    name: "AI Text Studio",
    description:
      "AI-powered text generation with OpenAI/Gemini APIs — 5 modes, server-side key handling and a demo fallback.",
    tags: ["OpenAI", "Gemini", "Text gen"],
    status: "Live",
  },
  {
    slug: "exp10",
    href: "/exp10",
    title: "exp10",
    name: "AI Helpdesk Chatbot",
    description:
      "College-website chatbot with persona system prompt, per-session memory and Generative AI API integration.",
    tags: ["Chatbot", "Gen AI API"],
    status: "Live",
  },
  {
    slug: "exp11",
    href: "/exp11",
    title: "exp11",
    name: "AI Content Studio",
    description:
      "AI content generation for blogs, emails and social posts — 5 formats with tone/length controls, copy and download.",
    tags: ["Blogs · Emails · Social", "OpenAI / Gemini"],
    status: "Live",
  },
  {
    slug: "exp12",
    href: "/exp12",
    title: "exp12",
    name: "AI Image Studio",
    description:
      "Text-to-image generation via public AI APIs — 6 styles, aspect ratios, prompt enhancement and Gemini image captioning.",
    tags: ["Pollinations", "DALL·E", "Gemini Vision"],
    status: "Live",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-sky-200 via-sky-50 to-emerald-50">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-16">
        <header className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl glass text-xl">
            <Waves className="size-5 text-sky-700" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">JU Web Dev AI</h1>
            <p className="text-xs text-foreground/60">
              Front-end experiments · each one its own route
            </p>
          </div>
        </header>

        <section
          aria-label="Experiments"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {experiments.map((exp) => {
            const card = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                    {exp.slug}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      exp.status === "Live"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold tracking-tight">
                  {exp.name}
                </h2>
                <p className="mt-2 min-h-[4.5rem] text-xs leading-relaxed text-foreground/70">
                  {exp.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium text-foreground/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {exp.href && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
                    Open experiment
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </>
            );

            const baseClass =
              "glass glass-hover group flex flex-col rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

            return exp.href ? (
              <Link key={exp.slug} href={exp.href} className={baseClass}>
                {card}
              </Link>
            ) : (
              <div
                key={exp.slug}
                className={`${baseClass} cursor-not-allowed opacity-70`}
                aria-disabled="true"
              >
                {card}
              </div>
            );
          })}
        </section>

        <footer className="mt-12 text-[11px] text-foreground/50">
          Built with Next.js · Tailwind CSS · shadcn/ui — each experiment is
          isolated under{" "}
          <code className="rounded bg-white/60 px-1">app/expN</code>
        </footer>
      </div>
    </main>
  );
}
