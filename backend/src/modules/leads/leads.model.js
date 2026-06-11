import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    customerName: { type: String, default: "" },
    mobile: { type: String, default: "" },
    image: { type: String, default: "" }, // URL or /uploads/... path
    quantity: { type: Number, default: null },
    unit: { type: String, enum: ["MG", "GRAM", "KG", ""], default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Follow-up", "Converted", "Lost"],
      default: "New",
    },
    remarks: { type: String, default: "" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);
