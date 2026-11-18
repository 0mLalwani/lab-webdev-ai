/* exp6 · Authentication & Authorization API server
   Run: npm run server:exp6   (port 4006) */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { connect } = require("../lib/db");
const { notFound, errorHandler } = require("../lib/http");
const { securityHeaders, rateLimit } = require("../lib/security");
const { userSchema } = require("./models/User");
const { createAuthRouter } = require("./routes/auth");
const { createUsersRouter } = require("./routes/users");

const PORT = Number(process.env.PORT) || Number(process.env.EXP6_PORT) || 4006;
const DB_NAME = "exp6_db";

/* Demo accounts seeded on every boot (in-memory DB resets anyway). */
const SEED_USERS = [
  { name: "Admin Demo", email: "admin@demo.dev", password: "Admin123!", role: "admin" },
  { name: "Regular User", email: "user@demo.dev", password: "User12345!", role: "user" },
];

async function seedUsers(User) {
  for (const seed of SEED_USERS) {
    const exists = await User.findOne({ email: seed.email });
    if (!exists) {
      await User.create({
        name: seed.name,
        email: seed.email,
        role: seed.role,
        passwordHash: await bcrypt.hash(seed.password, 10),
      });
      console.log(`[exp6] seeded ${seed.role}: ${seed.email}`);
    }
  }
}

async function createApp() {
  const connection = await connect(DB_NAME);
  const User = connection.model("User", userSchema);
  await seedUsers(User);

  const app = express();
  app.use(cors());
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", experiment: "exp6", db: DB_NAME });
  });

  app.use(
    "/api/auth",
    rateLimit({ windowMs: 60_000, max: 20 }),
    createAuthRouter(User)
  );
  app.use("/api/users", createUsersRouter(User));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

if (require.main === module) {
  createApp()
    .then((app) =>
      app.listen(PORT, () =>
        console.log(`[exp6] Auth API listening on http://localhost:${PORT}`)
      )
    )
    .catch((err) => {
      console.error("[exp6] failed to start:", err);
      process.exit(1);
    });
}

module.exports = { createApp };
