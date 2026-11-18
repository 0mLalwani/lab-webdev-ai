/* exp9 · AI text-generation API server (OpenAI / Gemini / demo mode)
   Run: npm run server:exp9   (port 4009) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders, rateLimit } = require("../lib/security");
const { configSummary } = require("../lib/ai");
const { createGenerateRouter } = require("./routes/generate");

const PORT = Number(process.env.PORT) || Number(process.env.EXP9_PORT) || 4009;

async function createApp() {
  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp9", ai: configSummary() });
  });

  app.use(
    "/api/generate",
    rateLimit({ windowMs: 60_000, max: 30 }),
    createGenerateRouter()
  );

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(
          `[exp9] AI Text API on http://localhost:${PORT} · provider: ${configSummary().provider}`
        )
      )
    )
    .catch((err) => {
      console.error("[exp9] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
