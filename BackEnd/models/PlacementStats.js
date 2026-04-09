import mongoose from "mongoose";

const placementStatsSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
      unique: true,
    },
    // We remove the massive 'records' array for scalability
    summary: {
      totalStudents: { type: Number, default: 0 },
      placedCount: { type: Number, default: 0 },
      unplacedCount: { type: Number, default: 0 },
      averagePackage: { type: Number, default: 0 },
      highestPackage: { type: Number, default: 0 },
      branchWiseStats: {
          type: Map,
          of: Number,
          default: {}
      }
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementStats", placementStatsSchema);
