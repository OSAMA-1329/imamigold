import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { env } from "../config/env.js";

const dir = path.resolve(env.uploadDir);
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
});
