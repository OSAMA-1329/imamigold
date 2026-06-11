import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "node:path";

import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/error.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import leadRoutes from "./modules/leads/leads.routes.js";
import chatRoutes from "./modules/chats/chats.routes.js";
import groupRoutes from "./modules/groups/groups.routes.js";
import notifRoutes from "./modules/notifications/notifications.routes.js";
import uploadRoutes from "./modules/uploads/uploads.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.use("/api/auth", rateLimit({ windowMs: 15 * 60_000, max: 100 }));

  app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use("/uploads", express.static(path.resolve(env.uploadDir)));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/groups", groupRoutes);
  app.use("/api/notifications", notifRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
