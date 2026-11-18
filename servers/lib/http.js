/* Small HTTP helpers shared by all three Express servers. */

/** Wrap async route handlers so rejections reach the error middleware. */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/** 404 for unknown routes. */
function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

/** Centralized error handler — normalises Mongoose errors to JSON. */
function errorHandler(err, req, res, _next) {
  // Mongoose validation errors -> 400 with field details
  if (err.name === "ValidationError") {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
    return res.status(400).json({ error: "Validation Error", details });
  }

  // Malformed ObjectId etc.
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid value for "${err.path}"`,
    });
  }

  // Duplicate key (unique index)
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Conflict",
      message: `Duplicate value for: ${Object.keys(err.keyValue).join(", ")}`,
    });
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: err.expose ? err.message : status >= 500 ? "Internal Server Error" : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}

/** Create an HTTP error with a status code. */
function httpError(status, message, details) {
  const err = new Error(message);
  err.statusCode = status;
  err.expose = true;
  if (details) err.details = details;
  return err;
}

module.exports = { asyncHandler, notFound, errorHandler, httpError };
