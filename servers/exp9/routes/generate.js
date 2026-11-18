/* exp9 · AI text-generation route: POST /api/generate */
const express = require("express");
const { asyncHandler, httpError } = require("../../lib/http");
const { generateText, configSummary } = require("../../lib/ai");

const MODES = ["freeform", "summarize", "rewrite", "brainstorm", "explain"];

const SYSTEMS = {
  freeform:
    "You are a concise, friendly writing assistant. Answer the user's request directly and clearly.",
  summarize:
    "You are an expert summarizer. Summarize the user's text as tight bullet points (3-6), keeping every key fact. Reply with only the summary.",
  rewrite:
    "You are an expert editor. Rewrite the user's text to be clearer and more polished while keeping its meaning and approximate length. Reply with only the rewritten text.",
  brainstorm:
    "You are a creative ideation partner. Give 6-8 distinct, practical ideas as a bulleted list for the user's topic, each with a one-line rationale.",
  explain:
    "You are a teacher who explains things simply with one short analogy. Explain the user's topic for a curious beginner, in under 150 words.",
};

/* Deterministic demo output per mode (used when no API key is set). */
function demoFor(mode) {
  return (lastUser) => {
    const topic = lastUser.slice(0, 120).replace(/\s+/g, " ").trim();
    const head = "🎬 DEMO MODE — no API key configured. Paste OPENAI_API_KEY or GEMINI_API_KEY into .env and restart for real AI.\n\n";
    const bodies = {
      freeform: `Here is a demo answer about: "${topic}"\n\n• This canned response proves the full request pipeline works: validation → provider layer → response → UI.\n• Swap in a real key and the same request returns genuine AI output.`,
      summarize: `DEMO SUMMARY of "${topic}":\n\n• The input was received and validated.\n• The mode-specific system prompt was applied.\n• A real model would condense the key points here.`,
      rewrite: `DEMO REWRITE of "${topic}" — in a real run, the model would rephrase this text with better clarity and flow while preserving its meaning.`,
      brainstorm: `DEMO BRAINSTORM for "${topic}":\n\n• Idea 1 — start small, validate fast.\n• Idea 2 — reuse existing components.\n• Idea 3-8 would be model-generated, context-aware suggestions.`,
      explain: `DEMO EXPLANATION of "${topic}" — imagine a friend explaining this over coffee: the real model breaks the concept into small steps with one friendly analogy.`,
    };
    return head + (bodies[mode] || bodies.freeform);
  };
}

function createGenerateRouter() {
  const router = express.Router();

  router.get("/config", (req, res) => res.json(configSummary()));

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { prompt, mode = "freeform", provider, maxTokens } = req.body || {};

      if (typeof prompt !== "string" || prompt.trim().length < 4)
        throw httpError(400, "Validation Error", {
          prompt: "Prompt must be at least 4 characters",
        });
      if (prompt.length > 4000)
        throw httpError(400, "Validation Error", {
          prompt: "Prompt must be 4000 characters or fewer",
        });
      if (!MODES.includes(mode))
        throw httpError(400, "Validation Error", {
          mode: `Mode must be one of: ${MODES.join(", ")}`,
        });
      if (provider && !["auto", "openai", "gemini", "demo"].includes(provider))
        throw httpError(400, "Validation Error", {
          provider: "Provider must be auto, openai, gemini or demo",
        });

      const tokens = Math.min(1024, Math.max(256, Number(maxTokens) || 800));
      const result = await generateText({
        system: SYSTEMS[mode],
        messages: [{ role: "user", content: prompt.trim() }],
        maxTokens: tokens,
        provider,
        demo: demoFor(mode),
      });

      res.json({ ...result, mode });
    })
  );

  return router;
}

module.exports = { createGenerateRouter, MODES };
