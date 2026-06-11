import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../modules/auth/auth.model.js";
import mongoose from "mongoose";

const seedUsers = [
  { name: "Admin Imami", email: "admin@imami.app", role: "admin", title: "Administrator" },
  { name: "Purchase Lead", email: "purchase@imami.app", role: "purchase", title: "Purchase" },
  { name: "Wholesale Lead", email: "wholesale@imami.app", role: "wholesale", title: "Wholesale" },
  { name: "Retail Staff", email: "retail@imami.app", role: "retail", title: "Retail" },
];

async function main() {
  await connectDB();
  const passwordHash = await bcrypt.hash("password", 10);
  for (const u of seedUsers) {
    await User.updateOne(
      { email: u.email },
      { $setOnInsert: { ...u, passwordHash, avatar: "" } },
      { upsert: true }
    );
  }
  console.log("[seed] users ready (password: 'password')");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
