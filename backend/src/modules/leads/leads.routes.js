import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./leads.controller.js";

const r = Router();
r.use(requireAuth);

r.get("/", ctrl.list);
r.get("/:id", ctrl.get);
r.post("/", requireRole("admin"), validate(ctrl.leadSchema), ctrl.create);
r.patch("/:id", requireRole("admin"), validate(ctrl.leadSchema.partial()), ctrl.update);
r.delete("/:id", requireRole("admin"), ctrl.remove);

export default r;
