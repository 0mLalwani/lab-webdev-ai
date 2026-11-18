/* exp6 · Auth routes — register / login / me */
const express = require("express");
const bcrypt = require("bcryptjs");

const { asyncHandler, httpError } = require("../../lib/http");
const { signToken, requireAuth } = require("../middleware/auth");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function createAuthRouter(User) {
  const router = express.Router();

  // POST /api/auth/register
  router.post(
    "/register",
    asyncHandler(async (req, res) => {
      const { name, email, password } = req.body;

      const details = {};
      if (!name || !String(name).trim()) details.name = "Name is required";
      if (!email || !EMAIL_RE.test(String(email).trim()))
        details.email = "A valid email is required";
      if (!password || String(password).length < 8)
        details.password = "Password must be at least 8 characters";
      if (Object.keys(details).length > 0) {
        throw httpError(400, "Validation Error", details);
      }

      const existing = await User.findOne({ email: String(email).toLowerCase() });
      if (existing) throw httpError(409, "An account with this email already exists");

      const passwordHash = await bcrypt.hash(String(password), 10);
      const user = await User.create({
        name: String(name).trim(),
        email: String(email).trim(),
        passwordHash,
        role: "user",
      });

      const token = signToken(user);
      res.status(201).json({ token, user: user.toSafeJSON() });
    })
  );

  // POST /api/auth/login
  router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        throw httpError(400, "Validation Error", {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        });
      }

      const user = await User.findOne({
        email: String(email).toLowerCase(),
      }).select("+passwordHash");
      const ok =
        user && (await bcrypt.compare(String(password), user.passwordHash));
      if (!ok) throw httpError(401, "Invalid email or password");

      const token = signToken(user);
      res.json({ token, user: user.toSafeJSON() });
    })
  );

  // GET /api/auth/me (protected)
  router.get("/me", requireAuth, asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.sub);
    if (!user) throw httpError(404, "User no longer exists");
    res.json({ user: user.toSafeJSON() });
  }));

  return router;
}

module.exports = { createAuthRouter };
