/* exp12 · AI image generation + captioning API server
   Run: npm run server:exp12   (port 4012) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders, rateLimit } = require("../lib/security");
const { createImageRouter } = require("./routes/image");

const PORT = Number(process.env.PORT) || Number(process.env.EXP12_PORT) || 4012;

async function createApp() {
  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  // Image payloads (base64 captions) need a bigger body limit.
  app.use(express.json({ limit: "8mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp12" });
  });

  app.use("/api/image", rateLimit({ windowMs: 60_000, max: 20 }), createImageRouter());

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(`[exp12] Image API on http://localhost:${PORT}`)
      )
    )
    .catch((err) => {
      console.error("[exp12] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
