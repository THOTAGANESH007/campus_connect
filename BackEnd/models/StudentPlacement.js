import mongoose from "mongoose";

const studentPlacementSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementStats",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "OTHER"],
    },
    company: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "N/A",
    },
    package: {
      type: Number,
      default: 0,
    },
    placementStatus: {
      type: String,
      enum: ["Placed", "Not Placed"],
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast aggregation
studentPlacementSchema.index({ batchId: 1 });
studentPlacementSchema.index({ branch: 1 });
studentPlacementSchema.index({ placementStatus: 1 });
studentPlacementSchema.index({ company: 1 });
studentPlacementSchema.index({ cgpa: 1 });

export default mongoose.model("StudentPlacement", studentPlacementSchema);
