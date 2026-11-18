import { ArrowRight, Mail, MapPin } from "lucide-react";

import { profile } from "../data";

export function HeroSection() {
  return (
    <section
      id="home"
      className="flex min-h-[82vh] scroll-mt-24 flex-col justify-center py-8 md:min-h-[88vh]"
    >
      <div className="glass-strong inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium">
        <span className="relative flex size-2">
          <span className="absolute size-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative size-2 rounded-full bg-emerald-500" />
        </span>
        {profile.availabilityNote}
      </div>

      <h1 className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(2,20,45,0.55)] sm:text-5xl md:text-6xl lg:text-7xl">
        {profile.name}
        <span className="text-sky-300">.</span>
      </h1>

      <p className="mt-3 text-base font-medium text-sky-200 sm:text-lg">
        {profile.role}
      </p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
        {profile.tagline}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="glass-strong group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          View my work
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="#contact"
          className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          Get in touch
        </a>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/80">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-sky-300" /> {profile.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Mail className="size-3.5 text-sky-300" /> {profile.email}
        </span>
      </div>

      <a
        href="#projects"
        className="mt-12 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        scroll <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
