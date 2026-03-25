import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["GENERAL", "PLACEMENT", "INTERVIEW", "INTERNSHIP", "ACADEMICS"],
      default: "GENERAL",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: { type: [commentSchema], default: [] },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
