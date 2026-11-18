export const PROJECTS = [
  { title: "Aurora UI", cat: "web", year: 2025, emoji: "🌈", desc: "Accessible component toolkit with 60+ widgets." },
  { title: "Pixel Forge", cat: "tools", year: 2024, emoji: "🛠️", desc: "Batch image pipeline for sprite sheets." },
  { title: "Orbit Runner", cat: "games", year: 2025, emoji: "🛰️", desc: "Endless physics runner built on canvas." },
  { title: "Lighthouse Log", cat: "web", year: 2023, emoji: "🔦", desc: "Performance budget tracker for CI pipelines." },
  { title: "Glyph Grid", cat: "tools", year: 2024, emoji: "🔠", desc: "Monospace font specimen generator." },
  { title: "Tidal Tactics", cat: "games", year: 2023, emoji: "♟️", desc: "Turn-based strategy prototype in the browser." },
  { title: "Prism Portfolio", cat: "web", year: 2026, emoji: "💠", desc: "Generative gradient portfolio template." },
  { title: "SketchSynth", cat: "tools", year: 2026, emoji: "🎛️", desc: "Turn doodles into layered SVG art." },
] as const;

export const FILTERS = ["all", "web", "tools", "games"] as const;
