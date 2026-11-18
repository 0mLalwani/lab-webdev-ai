/* exp11 · AI content generation: blogs, emails & social posts */
const express = require("express");
const { asyncHandler, httpError } = require("../../lib/http");
const { generateText, configSummary } = require("../../lib/ai");

const TYPES = ["blog", "email", "instagram", "x", "linkedin"];
const TONES = ["professional", "casual", "friendly", "witty", "persuasive"];
const LENGTHS = ["short", "medium", "long"];

const TYPE_GUIDES = {
  blog:
    "Return a blog post in Markdown: an SEO-friendly title (# ...), an engaging intro, 3-5 sections with subheadings (## ...) and concise paragraphs, then a closing call to action.",
  email:
    "Return an email: a Subject: line first, then the body with a greeting, 2-4 short paragraphs or bullets, and a warm professional sign-off.",
  instagram:
    "Return an Instagram caption: a scroll-stopping first line, an engaging body, then 8-12 relevant hashtags, each on its own line starting with #.",
  x: "Return a Twitter/X thread: number each tweet (1/, 2/, ...), every tweet under 280 characters, 4-8 tweets, hook in tweet 1, CTA in the last.",
  linkedin:
    "Return a LinkedIn post: a bold hook line, short paragraphs with line breaks, 3-5 professional insights or bullets, and 3-5 hashtags at the end.",
};

const TONE_DESC = {
  professional: "polished and professional",
  casual: "relaxed and conversational",
  friendly: "warm and approachable",
  witty: "playful with light humor",
  persuasive: "persuasive and benefit-focused",
};

const LENGTH_DESC = {
  short: "short — around 80-120 words",
  medium: "medium — around 200-300 words",
  long: "long — around 500-700 words",
};

function buildSystem({ type, tone, length }) {
  return [
    "You are an expert content writer working for a marketing team.",
    `Write in a ${TONE_DESC[tone]} tone.`,
    `Length: ${LENGTH_DESC[length]}.`,
    TYPE_GUIDES[type],
    "Write only the content — no meta commentary about these instructions.",
    "Base everything strictly on the topic the user provides.",
  ].join(" ");
}

/* Structured, topic-filled DEMO templates (used when no API key is set). */
function demoFor(type, topic) {
  const t = topic.trim().replace(/\s+/g, " ").slice(0, 80);
  const head =
    "🎬 DEMO MODE — no API key configured. Add GEMINI_API_KEY or OPENAI_API_KEY to .env and restart for real AI output.\n\n";
  const bodies = {
    blog: `# ${t}: A Practical Guide\n\n> Why ${t} matters more than ever this year.\n\n## Why start with ${t}?\nA short intro about ${t} and who it is for.\n\n## 1. The fundamentals\nThe first key idea, explained in 2-3 sentences.\n## 2. Common mistakes\nWhat to avoid when dealing with ${t}.\n## 3. Your next step\nA concrete action the reader can take today.\n\n**Ready to dive deeper?** Try ${t} this week and share your results.`,
    email: `Subject: Quick thoughts on ${t}\n\nHi [Name],\n\nI wanted to share a few thoughts about ${t} — it came up recently and it's worth a look.\n\n• The opportunity in one line\n• Why now is the right moment\n• What I need from you (just 10 minutes)\n\nAre you free this week for a quick call?\n\nBest regards,\n[Your name]`,
    instagram: `Stop scrolling — ${t} just got interesting. 👋\n\nThe short version: we broke ${t} into 3 simple steps you can try today. Save this for later and tag someone who needs it!\n\n#trending #howto #dailytips #learnontiktok #growth #community #instagood #explore`,
    x: `1/ We keep hearing about ${t} — but most advice gets it wrong. Here's a no-BS thread 👇\n\n2/ First thing about ${t}: it compounds. Small efforts now = big results later.\n\n3/ Step 1: start smaller than feels comfortable. Consistency beats intensity.\n\n4/ Step 2: measure one thing that matters. Ignore vanity metrics.\n\n5/ Bottom line on ${t}: start today, adjust tomorrow. Repost if you agree 🙌`,
    linkedin: `${t} taught me three lessons I wish I'd learned years ago. 🧵\n\n→ Lesson 1: clarity beats speed. Slow down to get ${t} right the first time.\n→ Lesson 2: feedback loops matter more than plans.\n→ Lesson 3: the people around you determine the ceiling.\n\nWhat has ${t} taught you? I'd love to read it in the comments.\n\n#careers #learning #growth`,
  };
  return head + (bodies[type] || bodies.blog);
}

function createContentRouter() {
  const router = express.Router();

  router.get("/config", (req, res) => res.json(configSummary()));

  router.post(
    "/generate",
    asyncHandler(async (req, res) => {
      const { type, topic, tone = "professional", length = "medium", keyPoints, provider } =
        req.body || {};

      const details = {};
      if (!TYPES.includes(type))
        details.type = `Type must be one of: ${TYPES.join(", ")}`;
      if (typeof topic !== "string" || topic.trim().length < 3)
        details.topic = "Topic must be at least 3 characters";
      else if (topic.length > 1000)
        details.topic = "Topic must be 1000 characters or fewer";
      if (!TONES.includes(tone))
        details.tone = `Tone must be one of: ${TONES.join(", ")}`;
      if (!LENGTHS.includes(length))
        details.length = `Length must be one of: ${LENGTHS.join(", ")}`;
      if (provider && !["auto", "openai", "gemini", "demo"].includes(provider))
        details.provider = "Provider must be auto, openai, gemini or demo";
      if (Object.keys(details).length > 0)
        throw httpError(400, "Validation Error", details);

      const userContent = keyPoints
        ? `Topic: ${topic.trim()}\nMust cover these points: ${String(keyPoints).slice(0, 1000)}`
        : `Topic: ${topic.trim()}`;

      const result = await generateText({
        system: buildSystem({ type, tone, length }),
        messages: [{ role: "user", content: userContent }],
        maxTokens: length === "short" ? 500 : length === "long" ? 1200 : 800,
        provider,
        demo: (lastUser) =>
          demoFor(type, lastUser.replace(/^Topic:\s*/, "").split("\n")[0]),
      });

      res.json({ ...result, type, tone, length });
    })
  );

  return router;
}

module.exports = { createContentRouter, TYPES, TONES, LENGTHS };

