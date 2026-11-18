"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/exp4", label: "Home" },
  { href: "/exp4/about", label: "About" },
  { href: "/exp4/services", label: "Services" },
  { href: "/exp4/contact", label: "Contact" },
];

/** Responsive navigation menu — sticky bar + hamburger below md. */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const close = React.useCallback(() => setOpen(false), []);

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `rounded-md px-3 py-2 text-sm font-medium transition ${
      active
        ? "text-teal-300"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b2545]/95 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href="/exp4"
          onClick={close}
          className="flex items-center gap-2 text-sm font-bold text-white sm:text-base"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-teal-400 text-[#0b2545]">
            B
          </span>
          Bluepeak Studio
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/exp4/contact"
            className="ml-4 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-[#0b2545] transition hover:bg-teal-300"
          >
            Start a project
          </Link>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="exp4-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-md text-slate-100 transition hover:bg-white/10 md:hidden"
        >
          <span className="text-xl" aria-hidden="true">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="exp4-mobile-menu"
          className="border-t border-white/10 bg-[#0b2545] px-5 py-3 md:hidden"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                pathname === link.href
                  ? "bg-white/10 text-teal-300"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
