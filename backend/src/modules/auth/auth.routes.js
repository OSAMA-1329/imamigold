import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as ctrl from "./auth.controller.js";

const r = Router();

r.post("/signup", validate(ctrl.signupSchema), ctrl.signup);
r.post("/signin", validate(ctrl.signinSchema), ctrl.signin);
r.get("/me", requireAuth, ctrl.me);

export default r;
