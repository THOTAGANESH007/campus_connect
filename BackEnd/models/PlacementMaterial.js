import mongoose from "mongoose";

const placementMaterialSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, required: true, maxlength: 2000 },
        category: {
            type: String,
            required: true,
            enum: [
                "Aptitude",
                "DSA & Coding",
                "Core CS (OS/DBMS/CN)",
                "System Design",
                "HR Preparation",
                "Resume Tips",
                "Company Specific",
                "Mock Tests",
                "Other",
            ],
        },
        materialType: {
            type: String,
            required: true,
            enum: ["Link", "PDF", "Notes", "Video"],
        },
        resourceUrl: { type: String, default: "" },   // For links or Cloudinary uploaded files
        fileName: { type: String, default: "" },       // Original filename if uploaded
        fileSize: { type: Number, default: 0 },        // In bytes
        company: { type: String, default: "" },        // Optional: company specific material
        tags: { type: [String], default: [] },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        downloads: { type: Number, default: 0 },
        isVerified: { type: Boolean, default: false }, // Admin can mark trusted resources
    },
    { timestamps: true }
);

placementMaterialSchema.index({ title: "text", description: "text", tags: "text", company: "text" });

export default mongoose.model("PlacementMaterial", placementMaterialSchema);
