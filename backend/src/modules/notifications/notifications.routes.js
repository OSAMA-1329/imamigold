import { Router } from "express";
import { Notification } from "./notifications.model.js";
import { requireAuth } from "../../middleware/auth.js";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res) => {
  const notifs = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
  res.json({ notifications: notifs });
});

r.post("/read-all", async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, unread: true }, { $set: { unread: false } });
  res.json({ ok: true });
});

r.post("/", async (req, res) => {
  // Admin can create for anyone; others only for self.
  const userId = req.user.role === "admin" && req.body.userId ? req.body.userId : req.user.id;
  const n = await Notification.create({ ...req.body, userId });
  res.status(201).json({ notification: n });
});

export default r;
