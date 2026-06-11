import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "purchase", "wholesale", "retail"],
      required: true,
      default: "retail",
    },
    title: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    title: this.title,
    avatar: this.avatar,
  };
};

export const User = mongoose.model("User", userSchema);
