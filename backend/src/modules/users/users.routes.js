import { Router } from "express";
import { User } from "../auth/auth.model.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error.js";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res) => {
  const { role } = req.query;
  const q = role ? { role } : {};
  const users = await User.find(q).sort({ name: 1 });
  res.json({ users: users.map((u) => u.toSafeJSON()) });
});

r.get("/:id", async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw new HttpError(404, "User not found");
  res.json({ user: u.toSafeJSON() });
});

r.patch("/:id", requireRole("admin"), async (req, res) => {
  const { name, role, title, avatar } = req.body;
  const u = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { ...(name && { name }), ...(role && { role }), ...(title !== undefined && { title }), ...(avatar !== undefined && { avatar }) } },
    { new: true }
  );
  if (!u) throw new HttpError(404, "User not found");
  res.json({ user: u.toSafeJSON() });
});

export default r;
