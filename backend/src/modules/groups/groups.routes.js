import { Router } from "express";
import { Chat } from "../chats/chats.model.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error.js";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res) => {
  const filter = { type: "group", ...(req.user.role === "admin" ? {} : { members: req.user.id }) };
  const groups = await Chat.find(filter).sort({ updatedAt: -1 });
  res.json({ groups });
});

r.post("/", requireRole("admin"), async (req, res) => {
  const { name, description = "", category = "custom", members = [], avatar = "" } = req.body;
  if (!name) throw new HttpError(400, "name required");
  const group = await Chat.create({
    type: "group",
    name,
    description,
    category,
    avatar,
    members: [...new Set([req.user.id, ...members])],
  });
  res.status(201).json({ group });
});

r.patch("/:id/members", requireRole("admin"), async (req, res) => {
  const { add = [], remove = [] } = req.body;
  const group = await Chat.findById(req.params.id);
  if (!group || group.type !== "group") throw new HttpError(404, "Group not found");
  const set = new Set(group.members.map((m) => m.toString()));
  add.forEach((id) => set.add(id));
  remove.forEach((id) => set.delete(id));
  group.members = [...set];
  await group.save();
  res.json({ group });
});

export default r;
