import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const interviewQuestionSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    driveYear: { type: String, required: true },
    roundType: {
      type: String,
      required: true,
      enum: ["Aptitude", "Technical", "Coding", "HR", "Group Discussion", "Case Study", "Other"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    questionTitle: { type: String, required: true, trim: true, maxlength: 200 },
    questionContent: { type: String, required: true, maxlength: 5000 },
    answerHint: { type: String, default: "", maxlength: 3000 },
    tags: { type: [String], default: [] },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: { type: [commentSchema], default: [] },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast searching
interviewQuestionSchema.index({ company: "text", jobRole: "text", questionTitle: "text", tags: "text" });

export default mongoose.model("InterviewQuestion", interviewQuestionSchema);
