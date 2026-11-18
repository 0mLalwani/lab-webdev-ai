import type { Metadata } from "next";

import { AboutSection } from "./_components/about-section";
import { ContactSection } from "./_components/contact-section";
import { HeroSection } from "./_components/hero-section";
import { PortfolioShell } from "./_components/portfolio-shell";
import { ProjectsSection } from "./_components/projects-section";
import { profile } from "./data";

export const metadata: Metadata = {
  title: "exp1 · Ocean Portfolio",
  description:
    "A responsive personal portfolio with a dark blue-sky parallax theme, glassy white UI and mono typography — built with Next.js, Tailwind CSS and shadcn/ui.",
};

export default function Exp1Page() {
  return (
    <PortfolioShell>
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />

      <footer className="glass mt-16 flex flex-col gap-2 rounded-2xl px-5 py-4 text-[11px] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 {profile.name} — exp1 · Ocean Portfolio
        </p>
        <p className="text-foreground/60">
          Next.js · Tailwind CSS · shadcn/ui · pure CSS/SVG parallax
        </p>
      </footer>
    </PortfolioShell>
  );
}
