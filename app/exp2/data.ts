export const features = [
  {
    icon: "⚡",
    title: "Real-time pipelines",
    text: "Stream events from any source into live dashboards with sub-second latency — no warehouses to babysit.",
  },
  {
    icon: "🧠",
    title: "AI anomaly alerts",
    text: "Models learn your baselines and flag what actually matters, so your team stops drowning in noise.",
  },
  {
    icon: "🔌",
    title: "200+ integrations",
    text: "Connect Stripe, Postgres, Segment, Salesforce and everything in between in a couple of clicks.",
  },
  {
    icon: "📊",
    title: "Dashboards as code",
    text: "Version, review and ship analytics with Git. Your metrics live next to your product code.",
  },
  {
    icon: "🔒",
    title: "SOC 2 & GDPR ready",
    text: "Row-level permissions, audit logs and EU/US data residency baked in from day one.",
  },
  {
    icon: "🚀",
    title: "Deploy anywhere",
    text: "Cloud, self-hosted or edge — one config file and you're running in your own VPC.",
  },
];

export const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    blurb: "For side projects and early prototypes.",
    perks: ["1 project", "10k events / month", "Community support", "7-day retention"],
    featured: false,
    cta: "Start free",
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    blurb: "For growing teams shipping fast.",
    perks: [
      "Unlimited projects",
      "1M events / month",
      "AI anomaly alerts",
      "Priority support",
      "1-year retention",
    ],
    featured: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "For scale, compliance and control.",
    perks: [
      "Unlimited everything",
      "SSO / SAML",
      "Dedicated VPC deploy",
      "99.99% SLA",
      "Named success manager",
    ],
    featured: false,
    cta: "Talk to sales",
  },
];

export const testimonials = [
  {
    quote:
      "We replaced three tools with Nebula. Setup took an afternoon and our on-call noise dropped by 60% in the first week.",
    name: "Priya Nair",
    role: "VP Engineering, Loopwork",
  },
  {
    quote:
      "Dashboards as code sounded like a gimmick until our analysts stopped fighting over who broke the funnel view.",
    name: "Marcus Feld",
    role: "Head of Data, Parcelly",
  },
  {
    quote:
      "The AI alerts just work. It catches revenue dips before our customers even notice them.",
    name: "Sofia Almeida",
    role: "COO, Brightlane",
  },
];

export const stats = [
  { value: "4.2B", label: "events processed / mo" },
  { value: "2,100+", label: "teams onboard" },
  { value: "312ms", label: "p95 query latency" },
  { value: "99.99%", label: "uptime SLA" },
];
