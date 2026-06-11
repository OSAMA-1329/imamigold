import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";

const r = Router();

r.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "file required" });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({
    url,
    name: req.file.originalname,
    size: req.file.size,
    mime: req.file.mimetype,
  });
});

export default r;
