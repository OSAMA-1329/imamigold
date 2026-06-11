import dotenv from "dotenv";
dotenv.config();

const required = (key, fallback) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing env: ${key}`);
  return v;
};

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/imamihub"),
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 20),
};
