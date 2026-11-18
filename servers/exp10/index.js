/* exp10 · AI chatbot API server (college helpdesk persona)
   Run: npm run server:exp10   (port 4010) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders, rateLimit } = require("../lib/security");
const { configSummary } = require("../lib/ai");
const { createChatRouter } = require("./routes/chat");

const PORT = Number(process.env.PORT) || Number(process.env.EXP10_PORT) || 4010;

async function createApp() {
  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp10", ai: configSummary() });
  });

  app.use("/api/chat", rateLimit({ windowMs: 60_000, max: 40 }), createChatRouter());

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(
          `[exp10] Chatbot API on http://localhost:${PORT} · provider: ${configSummary().provider}`
        )
      )
    )
    .catch((err) => {
      console.error("[exp10] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
