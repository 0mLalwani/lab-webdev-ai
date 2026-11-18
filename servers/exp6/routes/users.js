/* exp6 · Admin-only user management routes (demonstrates authorization) */
const express = require("express");

const { asyncHandler, httpError } = require("../../lib/http");
const { requireAuth, requireRole } = require("../middleware/auth");

function createUsersRouter(User) {
  const router = express.Router();

  // Both routes require auth AND the "admin" role -> 401 without token,
  // 403 with a non-admin token.
  router.use(requireAuth, requireRole("admin"));

  // GET /api/users — list all users (admin only)
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const users = await User.find().sort("-createdAt").lean();
      res.json({
        data: users.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        })),
      });
    })
  );

  // DELETE /api/users/:id — remove a user (admin only)
  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) throw httpError(404, "User not found");
      res.status(204).end();
    })
  );

  return router;
}

module.exports = { createUsersRouter };
