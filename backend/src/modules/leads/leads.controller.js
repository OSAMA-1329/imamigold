import { z } from "zod";
import { Lead } from "./leads.model.js";
import { HttpError } from "../../middleware/error.js";

export const leadSchema = z.object({
  customerName: z.string().optional().default(""),
  mobile: z.string().optional().default(""),
  image: z.string().optional().default(""),
  quantity: z.union([z.number(), z.string()]).optional().nullable(),
  unit: z.enum(["MG", "GRAM", "KG", ""]).optional().default(""),
  status: z.enum(["New", "Contacted", "Follow-up", "Converted", "Lost"]).optional().default("New"),
  remarks: z.string().optional().default(""),
  assignedTo: z.array(z.string()).optional().default([]),
});

const scope = (user) =>
  user.role === "admin" ? {} : { assignedTo: user.id };

export async function list(req, res) {
  const leads = await Lead.find(scope(req.user))
    .sort({ createdAt: -1 })
    .populate("assignedTo", "name email role");
  res.json({ leads });
}

export async function get(req, res) {
  const lead = await Lead.findOne({ _id: req.params.id, ...scope(req.user) })
    .populate("assignedTo", "name email role");
  if (!lead) throw new HttpError(404, "Lead not found");
  res.json({ lead });
}

export async function create(req, res) {
  const data = { ...req.body, createdBy: req.user.id };
  if (data.quantity === "" || data.quantity === undefined) data.quantity = null;
  const lead = await Lead.create(data);
  res.status(201).json({ lead });
}

export async function update(req, res) {
  const data = { ...req.body };
  if (data.quantity === "" || data.quantity === undefined) data.quantity = null;
  const lead = await Lead.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
  if (!lead) throw new HttpError(404, "Lead not found");
  res.json({ lead });
}

export async function remove(req, res) {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new HttpError(404, "Lead not found");
  res.json({ ok: true });
}
