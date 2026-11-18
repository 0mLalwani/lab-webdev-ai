"use client";

import * as React from "react";
import { FolderGit2, Mail, UserRound, Waves } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { navSections, profile, socials, type SocialKey } from "../data";

/* -------------------------------------------------------
   Brand glyphs — lucide-react v1 removed brand icons, so
   these are inline, Feather-style stroke SVGs.
   ------------------------------------------------------- */
type GlyphProps = React.SVGProps<SVGSVGElement>;

function GlyphBase({ children, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

function GithubGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </GlyphBase>
  );
}

function LinkedinGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </GlyphBase>
  );
}

function XGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </GlyphBase>
  );
}

function InstagramGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </GlyphBase>
  );
}

function EmailGlyph(props: GlyphProps) {
  return (
    <GlyphBase {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </GlyphBase>
  );
}

const sectionIcons = {
  home: Waves,
  projects: FolderGit2,
  about: UserRound,
  contact: Mail,
} as const;

const socialGlyphs: Record<SocialKey, React.ComponentType<GlyphProps>> = {
  github: GithubGlyph,
  linkedin: LinkedinGlyph,
  twitter: XGlyph,
  instagram: InstagramGlyph,
  email: EmailGlyph,
};

/**
 * Expandable glass sidebar for exp1.
 * - Desktop: icon rail ⇄ expanded panel (trigger / edge rail / Ctrl+B)
 * - Mobile:  floating logo button opens a glassy slide-in sheet
 */
export function ExpSidebar() {
  const { isMobile, openMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const [active, setActive] = React.useState("home");

  /* Highlight the section currently in view */
  React.useEffect(() => {
    const els = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.1, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMobile = React.useCallback(
    () => setOpenMobile(false),
    [setOpenMobile]
  );

  /* Floating toggle is only needed on mobile — on desktop the icon rail
     itself stays visible with its own trigger. */
  const showFloating = isMobile && !openMobile;

  return (
    <>
      <Sidebar
        side="left"
        collapsible="icon"
        className="glass rounded-r-2xl [&_[data-slot=sidebar-inner]]:bg-transparent"
      >
        {/* Home logo + expand/collapse trigger */}
        <SidebarHeader className="flex-row items-center gap-2">
          <a
            href="#home"
            onClick={closeMobile}
            className="group/logo flex min-w-0 flex-1 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-600/60 group-data-[state=collapsed]:hidden"
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-lg glass-strong text-sm"
              role="img"
              aria-label="Home"
            >
              🌊
            </span>
            <span className="truncate text-sm font-bold tracking-tight">
              {profile.name}
            </span>
          </a>
          <SidebarTrigger className="size-8 shrink-0 rounded-lg text-foreground/70 group-data-[state=collapsed]:mx-auto hover:bg-white/60 hover:text-foreground" />
        </SidebarHeader>

        {/* Section navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.25em] text-foreground/50 group-data-[state=collapsed]:hidden">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSections.map((section) => {
                  const Icon = sectionIcons[
                    section.id as keyof typeof sectionIcons
                  ] ?? Waves;
                  return (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={active === section.id}
                        tooltip={section.label}
                        className="rounded-xl"
                      >
                        <a href={`#${section.id}`} onClick={closeMobile}>
                          <Icon className="size-4" />
                          <span>{section.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Social media buttons */}
        <SidebarFooter>
          <SidebarSeparator />
          <div className="flex flex-wrap items-center justify-center gap-1 group-data-[state=collapsed]:flex-col">
            {socials.map((social) => {
              const Glyph = socialGlyphs[social.key];
              return (
                <a
                  key={social.key}
                  href={social.url}
                  target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  title={social.label}
                  aria-label={social.label}
                  className="grid size-8 place-items-center rounded-lg text-foreground/70 transition hover:bg-white/70 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <Glyph className="size-4" />
                </a>
              );
            })}
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Floating glass toggle — mobile (sidebar closed) / desktop rail (collapsed) */}
      {showFloating && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isMobile ? "Open menu" : "Expand sidebar"}
          className="glass-strong fixed bottom-5 left-5 z-40 grid size-12 place-items-center rounded-full text-lg transition hover:scale-105 hover:shadow-[0_12px_36px_rgba(10,40,80,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          <span role="img" aria-hidden="true">
            🌊
          </span>
        </button>
      )}
    </>
  );
}

