import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as ctrl from "./chats.controller.js";

const r = Router();
r.use(requireAuth);

r.get("/", ctrl.list);
r.get("/:id", ctrl.get);
r.post("/direct", ctrl.createDirect);
r.post("/:id/messages", ctrl.sendMessage);
r.delete("/:id/messages/:mid", ctrl.deleteMessage);
r.delete("/:id", ctrl.remove);

export default r;
