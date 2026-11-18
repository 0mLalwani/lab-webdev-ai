/**
 * exp1 · portfolio content
 * -------------------------------------------------
 * Edit this single file to personalize the portfolio.
 */

export const profile = {
  name: "Alex Rivera",
  initials: "AR",
  role: "Full-Stack Developer & UI Designer",
  tagline:
    "I design and build wave-making interfaces for the modern web — fast, accessible and a little bit fun.",
  location: "Kolkata, India",
  email: "alex.rivera@example.com",
  phone: "+91 98765 43210",
  availabilityNote: "Open to internships & freelance work",
};

export type NavSection = { id: string; label: string };

export const navSections: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About Me" },
  { id: "contact", label: "Contact" },
];

export type Project = {
  title: string;
  emoji: string;
  year: string;
  description: string;
  tags: string[];
  link: string;
  gradient: string;
};

export const projects: Project[] = [
  {
    title: "Reef Analytics",
    emoji: "🪸",
    year: "2025",
    description:
      "A real-time analytics dashboard for marine research data with interactive charts, filters and CSV export.",
    tags: ["Next.js", "TypeScript", "D3.js"],
    link: "#",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #2f9ac9 100%)",
  },
  {
    title: "TideNotes",
    emoji: "🌊",
    year: "2025",
    description:
      "A collaborative note-taking app with offline sync, markdown editing and shared workspaces.",
    tags: ["React", "Node.js", "PostgreSQL"],
    link: "#",
    gradient: "linear-gradient(135deg, #155e96 0%, #6cc9e8 100%)",
  },
  {
    title: "Coral Commerce",
    emoji: "🛍️",
    year: "2024",
    description:
      "Headless e-commerce storefront with cart, checkout flows and a fully themeable design system.",
    tags: ["Next.js", "Stripe", "Tailwind"],
    link: "#",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #38bdf8 100%)",
  },
  {
    title: "Marina CLI",
    emoji: "⚓",
    year: "2024",
    description:
      "A developer CLI that scaffolds production-ready Next.js modules with tests and CI baked in.",
    tags: ["TypeScript", "CLI", "Vitest"],
    link: "#",
    gradient: "linear-gradient(135deg, #0f766e 0%, #5eead4 100%)",
  },
  {
    title: "Seabird Tracking Map",
    emoji: "🕊️",
    year: "2024",
    description:
      "An interactive map visualising migration routes with clustered markers and animated paths.",
    tags: ["Mapbox GL", "React", "GeoJSON"],
    link: "#",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #93c5fd 100%)",
  },
  {
    title: "Shell — Design System",
    emoji: "🐚",
    year: "2023",
    description:
      "A library of 40+ accessible, glassmorphic UI primitives documented with live playgrounds.",
    tags: ["Radix UI", "Storybook", "CSS"],
    link: "#",
    gradient: "linear-gradient(135deg, #be185d 0%, #fda4af 100%)",
  },
];

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Figma",
  "Git",
  "REST APIs",
  "Testing",
];

export const aboutParagraphs = [
  "I'm a developer and designer who loves the intersection of engineering and craft. I spend my days turning Figma files into fast, accessible interfaces — and my nights experimenting with animations, colour and motion.",
  "I care about clean semantics, sensible defaults and performance budgets. When something feels smooth and effortless to use, that's usually a hundred small decisions hiding underneath.",
];

export const timeline = [
  {
    period: "2024 — Now",
    title: "B.Tech, Computer Science",
    place: "Example University",
    note: "Focus on human-computer interaction and web technologies.",
  },
  {
    period: "2024",
    title: "Frontend Intern · Wave Labs",
    place: "Remote",
    note: "Shipped a component library used across 3 product teams.",
  },
  {
    period: "2023",
    title: "First open-source contribution",
    place: "GitHub",
    note: "Started contributing to React ecosystem tooling.",
  },
];

export type SocialKey = "github" | "linkedin" | "twitter" | "instagram" | "email";

export type Social = { key: SocialKey; label: string; url: string };

export const socials: Social[] = [
  { key: "github", label: "GitHub", url: "https://github.com/yourhandle" },
  { key: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/yourhandle" },
  { key: "twitter", label: "X / Twitter", url: "https://x.com/yourhandle" },
  { key: "instagram", label: "Instagram", url: "https://instagram.com/yourhandle" },
  { key: "email", label: "Email", url: "mailto:alex.rivera@example.com" },
];
