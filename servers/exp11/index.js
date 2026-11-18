/* exp11 · AI content generation API server (blogs / emails / social posts)
   Run: npm run server:exp11   (port 4011) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders, rateLimit } = require("../lib/security");
const { configSummary } = require("../lib/ai");
const { createContentRouter } = require("./routes/content");

const PORT = Number(process.env.PORT) || Number(process.env.EXP11_PORT) || 4011;

async function createApp() {
  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp11", ai: configSummary() });
  });

  app.use(
    "/api/content",
    rateLimit({ windowMs: 60_000, max: 30 }),
    createContentRouter()
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
          `[exp11] Content API on http://localhost:${PORT} · provider: ${configSummary().provider}`
        )
      )
    )
    .catch((err) => {
      console.error("[exp11] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
