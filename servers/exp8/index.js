/* exp8 · Student Management System API server (MongoDB + Express.js)
   Run: npm run server:exp8   (port 4008) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connect } = require("../lib/db");
const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders } = require("../lib/security");
const { studentSchema, SEED_STUDENTS } = require("./models/Student");
const { createStudentsRouter } = require("./routes/students");

const PORT = Number(process.env.PORT) || Number(process.env.EXP8_PORT) || 4008;
const DB_NAME = "exp8_db";

/* Seed demo students once (skips duplicates via the unique rollNo index). */
async function seedStudents(Student) {
  for (const seed of SEED_STUDENTS) {
    const exists = await Student.findOne({ rollNo: seed.rollNo });
    if (!exists) await Student.create(seed);
  }
}

async function createApp() {
  const connection = await connect(DB_NAME);
  const Student = connection.model("Student", studentSchema);

  // Build indexes once at boot (unique rollNo/email + course/gpa sort index).
  await Student.init();
  await Student.syncIndexes();
  await seedStudents(Student);

  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp8", db: DB_NAME });
  });

  app.use("/api/students", createStudentsRouter(Student));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(`[exp8] Student API listening on http://localhost:${PORT}`)
      )
    )
    .catch((err) => {
      console.error("[exp8] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
