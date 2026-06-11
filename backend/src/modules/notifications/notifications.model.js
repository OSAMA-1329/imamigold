import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, default: "info" },
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    link: { type: String, default: "" },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
