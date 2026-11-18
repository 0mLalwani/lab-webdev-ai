import Link from "next/link";

import { NewsletterForm } from "./_components/newsletter-form";
import { SiteNav } from "./_components/site-nav";

export const metadata = {
  title: {
    default: "exp4 · Bluepeak Studio",
    template: "%s · exp4 Bluepeak Studio",
  },
  description:
    "Multi-page responsive website with navigation menu, forms, client-side validation and AI-assisted development tools.",
};

export default function Exp4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900">
      <SiteNav />

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0b2545] text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-teal-400 text-sm text-[#0b2545]">
                B
              </span>
              Bluepeak Studio
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              A fictional design &amp; development studio — this multi-page
              site is exp4: navigation, responsive layouts, forms and
              client-side validation.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Sitemap
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="hover:text-teal-300" href="/exp4">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-300" href="/exp4/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-300" href="/exp4/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-teal-300" href="/exp4/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Newsletter
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Monthly notes on design and engineering.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
          © 2026 Bluepeak Studio (fictional) — exp4 · multi-page + validation ·{" "}
          <Link href="/" className="text-slate-400 hover:text-teal-300">
            all experiments
          </Link>
        </div>
      </footer>
    </div>
  );
}
