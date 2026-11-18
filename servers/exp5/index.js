/* exp5 · CRUD API server (Node.js + Express.js + MongoDB)
   Run: npm run server:exp5   (port 4005) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connect } = require("../lib/db");
const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders } = require("../lib/security");
const { taskSchema } = require("./models/Task");
const { createTasksRouter } = require("./routes/tasks");

const PORT = Number(process.env.PORT) || Number(process.env.EXP5_PORT) || 4005;
const DB_NAME = "exp5_db";

async function createApp() {
  const connection = await connect(DB_NAME);
  const Task = connection.model("Task", taskSchema);

  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp5", db: DB_NAME });
  });

  app.use("/api/tasks", createTasksRouter(Task));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(`[exp5] CRUD API listening on http://localhost:${PORT}`)
      )
    )
    .catch((err) => {
      console.error("[exp5] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
