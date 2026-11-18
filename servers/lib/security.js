/* Dependency-free security middleware shared by the API experiments.
   Keeps the demo deployable without extra packages: baseline response
   headers plus a small fixed-window rate limiter for sensitive routes. */

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // APIs are intentionally called from the Vercel front-end origin.
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}

/**
 * Fixed-window rate limiter, keyed by client IP.
 * @param {{ windowMs?: number, max?: number, message?: string }} [options]
 */
function rateLimit({
  windowMs = 60_000,
  max = 60,
  message = "Too many requests — please slow down and try again shortly.",
} = {}) {
  const hits = new Map();

  const cleaner = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.reset <= now) hits.delete(key);
    }
  }, windowMs);
  if (typeof cleaner.unref === "function") cleaner.unref();

  function middleware(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({ error: "Too Many Requests", message });
    }
    next();
  }

  middleware.stop = () => clearInterval(cleaner);
  return middleware;
}

module.exports = { securityHeaders, rateLimit };
