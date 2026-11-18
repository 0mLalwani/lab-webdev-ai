/* exp13 · Single-process API gateway for cloud deployment.
   Run: npm run server:gateway   (port 4100, or PORT when hosted)

   Mounts every Express experiment under its own path prefix so one Render
   web service can serve all eight APIs:

     /exp5/api/...   /exp6/api/...   ...   /exp12/api/...

   Locally the UI still talks to the individual ports; in production set
   NEXT_PUBLIC_API_EXP5=https://<gateway>/exp5, and so on. */
require("dotenv").config();

const express = require("express");

const { createApp: createExp5App } = require("./exp5");
const { createApp: createExp6App } = require("./exp6");
const { createApp: createExp7App } = require("./exp7");
const { createApp: createExp8App } = require("./exp8");
const { createApp: createExp9App } = require("./exp9");
const { createApp: createExp10App } = require("./exp10");
const { createApp: createExp11App } = require("./exp11");
const { createApp: createExp12App } = require("./exp12");

const PORT = Number(process.env.PORT) || Number(process.env.GATEWAY_PORT) || 4100;

async function main() {
  const apps = await Promise.all([
    createExp5App(),
    createExp6App(),
    createExp7App(),
    createExp8App(),
    createExp9App(),
    createExp10App(),
    createExp11App(),
    createExp12App(),
  ]);

  const gateway = express();
  gateway.disable("x-powered-by");

  const mounted = apps.map((app, index) => {
    const prefix = `/exp${index + 5}`;
    gateway.use(prefix, app);
    return prefix;
  });

  gateway.get("/", (req, res) => {
    res.json({
      status: "ok",
      gateway: "ju-web-dev-ai",
      experiments: mounted,
      health: mounted.map((prefix) => `${prefix}/api/health`),
    });
  });

  gateway.listen(PORT, () => {
    console.log(`[gateway] API gateway on http://localhost:${PORT}`);
    for (const prefix of mounted) {
      console.log(`[gateway]   ${prefix}  →  http://localhost:${PORT}${prefix}/api/health`);
    }
  });
}

main().catch((err) => {
  console.error("[gateway] failed to start:", err);
  process.exit(1);
});
