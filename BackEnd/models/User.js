import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password_hash: {
      type: String,
      required: true,
    },
    phone: { type: String },
    role: {
      type: String,
      enum: ["STUDENT", "ADMIN", "PLACEMENT_OFFICER"],
      default: "STUDENT",
    },
    is_active: { type: Boolean, default: true },
    profile: { type: String, default: "" },

    // Academic / Student Profile Fields
    cgpa:   { type: Number, min: 0, max: 10, default: null },
    branch: { type: String, default: "" },
    skills: { type: [String], default: [] },
    resume: { type: String, default: "" }, // Cloudinary URL

    // Bookmark References
    savedDrives:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Drive" }],
    savedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "InterviewQuestion" }],
    savedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlacementMaterial" }],

    // Auth helpers
    forgot_password_otp:     { type: String, default: null },
    forgot_password_expired: { type: Date,   default: null },
    fcmToken: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
