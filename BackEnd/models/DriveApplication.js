import mongoose from "mongoose";

const driveApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

// One application per student per drive
driveApplicationSchema.index({ userId: 1, driveId: 1 }, { unique: true });

export default mongoose.model("DriveApplication", driveApplicationSchema);
