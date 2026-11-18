/* Runs all three backend experiments in one process with one shared
   in-memory MongoDB instance.
   Run: npm run server:all
     exp5 CRUD API  -> http://localhost:4005
     exp6 Auth API  -> http://localhost:4006
     exp7 REST API  -> http://localhost:4007  (docs: /api-docs) */
require("dotenv").config();

const { createApp: createExp5App } = require("./exp5");
const { createApp: createExp6App } = require("./exp6");
const { createApp: createExp7App } = require("./exp7");
const { createApp: createExp8App } = require("./exp8");
const { createApp: createExp9App } = require("./exp9");
const { createApp: createExp10App } = require("./exp10");
const { createApp: createExp11App } = require("./exp11");
const { createApp: createExp12App } = require("./exp12");
const { disconnectAll } = require("./lib/db");

async function main() {
  const [exp5, exp6, exp7, exp8, exp9, exp10, exp11, exp12] = await Promise.all([
    createExp5App(),
    createExp6App(),
    createExp7App(),
    createExp8App(),
    createExp9App(),
    createExp10App(),
    createExp11App(),
    createExp12App(),
  ]);

  const servers = [
    [exp5, 4005, "exp5 · CRUD API"],
    [exp6, 4006, "exp6 · Auth API"],
    [exp7, 4007, "exp7 · REST API (+ /api-docs)"],
    [exp8, 4008, "exp8 · Student Management API"],
    [exp9, 4009, "exp9 · AI Text Generation API"],
    [exp10, 4010, "exp10 · AI Chatbot API"],
    [exp11, 4011, "exp11 · AI Content Generation API"],
    [exp12, 4012, "exp12 · Image Generation & Captioning API"],
  ];

  for (const [app, port, label] of servers) {
    app.listen(port, () =>
      console.log(`[all] ${label} listening on http://localhost:${port}`)
    );
  }

  const shutdown = async () => {
    console.log("\n[all] shutting down…");
    await disconnectAll();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[all] failed to start:", err);
  process.exit(1);
});
