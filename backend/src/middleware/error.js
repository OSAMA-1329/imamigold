export function notFound(req, res) {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error("[error]", err);
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(err.details ? { details: err.details } : {}),
  });
}

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
