/* exp6 · Auth middleware — JWT verification + role-based authorization */
const jwt = require("jsonwebtoken");
const { httpError } = require("../../lib/http");

const JWT_SECRET = process.env.JWT_SECRET || "exp6-dev-secret-change-me";

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

/** Requires a valid `Authorization: Bearer <token>` header. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      httpError(401, "Authentication required — send Authorization: Bearer <token>")
    );
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(httpError(401, "Invalid or expired token"));
  }
}

/** Requires the authenticated user to hold one of the given roles. */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth) return next(httpError(401, "Authentication required"));
    if (!roles.includes(req.auth.role)) {
      return next(httpError(403, `Forbidden — requires role: ${roles.join(" or ")}`));
    }
    next();
  };
}

module.exports = { JWT_SECRET, signToken, requireAuth, requireRole };
