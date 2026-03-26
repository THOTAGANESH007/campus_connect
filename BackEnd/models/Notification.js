import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["NEW_DRIVE", "STATUS_UPDATE", "GENERAL"],
      default: "GENERAL",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" }, // optional deep-link url
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
