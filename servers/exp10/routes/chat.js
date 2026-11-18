/* exp10 · AI chatbot route: POST /api/chat (Bluepeak University helpdesk) */
const crypto = require("crypto");
const express = require("express");

const { asyncHandler, httpError } = require("../../lib/http");
const { generateText, configSummary } = require("../../lib/ai");

const SYSTEM_PROMPT = [
  "You are the friendly virtual helpdesk assistant of Bluepeak University,",
  "a fictional college. Help visitors with admissions, courses, fees, hostels,",
  "facilities, placements and contact details.",
  "Rules: keep answers under 120 words, use plain language, be warm and",
  "professional. If you don't know something specific, say so and suggest",
  "emailing admissions@bluepeak.example.edu. Never invent exact dates or fees.",
].join(" ");

/* In-memory session history: sessionId -> [{role, content}] (capped). */
const sessions = new Map();
const MAX_TURNS = 12; // messages kept per session

/* Keyword-based helpdesk answers used only in DEMO mode (no API key). */
function demoChat(lastUser) {
  const q = lastUser.toLowerCase();
  const faq = [
    [/admission|apply|eligib|entrance/, "Admissions open twice a year (July & January). You apply online through the Admissions portal — send transcripts to admissions@bluepeak.example.edu and they reply within 2 working days."],
    [/fee|tuition|cost|price|scholar/, "Tuition varies by programme (roughly ₹40k–₹1.2L per semester). Merit-cum-means scholarships cover up to 50% for top performers — admissions@bluepeak.example.edu can check your eligibility."],
    [/hostel|dorm|stay|accommod/, "There are 4 on-campus hostels with Wi-Fi, 24×7 security and shared kitchens. Rooms are allotted after you accept your offer — apply early, they fill fast."],
    [/course|program|degree|branch|major/, "We offer B.Tech, M.Tech, BBA and M.Sc programmes across CSE, ECE, ME and CE. Each programme page on the site lists the full syllabus and credit structure."],
    [/placement|job|intern|career/, "The Placement Cell works from the 5th semester — last year 92% of eligible students received offers, with 180+ recruiting companies on campus."],
    [/contact|email|phone|office/, "You can reach the helpdesk at hello@bluepeak.example.edu or +1 555 010 2030, Monday–Friday, 9:00–17:00."],
    [/timings|hours|open|when/, "The office is open Monday–Friday, 9:00–17:00. The library and cafeterias stay open until 21:00 on weekdays."],
  ];
  for (const [rx, answer] of faq) {
    if (rx.test(q)) return `DEMO MODE (no API key) — canned helpdesk answer:\n\n${answer}`;
  }
  return "DEMO MODE (no API key configured).\n\nI received your message: \"" +
    lastUser.slice(0, 120) +
    "\"\n\nAdd GEMINI_API_KEY or OPENAI_API_KEY to .env and restart `npm run server:exp10` for real AI answers. For now try asking about admissions, fees, hostels, courses or placements — those have canned demo answers.";
}

function createChatRouter() {
  const router = express.Router();

  router.get("/config", (req, res) => res.json(configSummary()));

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { message, sessionId, provider } = req.body || {};

      if (typeof message !== "string" || !message.trim())
        throw httpError(400, "Validation Error", {
          message: "Message is required",
        });
      if (message.length > 2000)
        throw httpError(400, "Validation Error", {
          message: "Message must be 2000 characters or fewer",
        });

      const id =
        typeof sessionId === "string" && /^[a-zA-Z0-9_-]{8,64}$/.test(sessionId)
          ? sessionId
          : crypto.randomUUID();

      const history = sessions.get(id) || [];
      history.push({ role: "user", content: message.trim() });

      const result = await generateText({
        system: SYSTEM_PROMPT,
        messages: history.slice(-MAX_TURNS),
        maxTokens: 600,
        provider,
        demo: demoChat,
      });

      history.push({ role: "assistant", content: result.text });
      sessions.set(id, history.slice(-MAX_TURNS * 2));

      res.json({ reply: result.text, sessionId: id, provider: result.provider, demo: result.demo });
    })
  );

  // Reset a session (204 regardless of existence — idempotent)
  router.delete("/:sessionId", (req, res) => {
    sessions.delete(req.params.sessionId);
    res.status(204).end();
  });

  return router;
}

module.exports = { createChatRouter };
