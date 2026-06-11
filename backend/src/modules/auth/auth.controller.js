import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "./auth.model.js";
import { signToken } from "../../middleware/auth.js";
import { HttpError } from "../../middleware/error.js";

export const signupSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "purchase", "wholesale", "retail"]).default("retail"),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signup(req, res) {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, "Email already registered");
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user);
  res.status(201).json({ token, user: user.toSafeJSON() });
}

export async function signin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(401, "Invalid email or password");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");
  const token = signToken(user);
  res.json({ token, user: user.toSafeJSON() });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user: user.toSafeJSON() });
}
