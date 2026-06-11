import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, name: user.name, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role === "admin") return next();
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
