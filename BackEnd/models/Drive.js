import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

const driveSchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true },
        companyDescription: { type: String, required: true },
        jobRole: { type: String, required: true },
        jobDescription: { type: String, required: true },
        ctc: { type: String, required: true },
        jobType: { type: String, required: true },
        driveTitle: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        registrationDeadline: { type: Date, required: true },
        numberOfRounds: { type: Number, required: true },
        rounds: { type: [roundSchema], default: [] },
        eligibleBranches: { type: [String], required: true },
        minCgpa: { type: Number, required: true, min: 0, max: 10 },
        passingYear: { type: String, required: true },
        backlogsAllowed: { type: Boolean, default: false },
        registrationLink: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Drive", driveSchema);
