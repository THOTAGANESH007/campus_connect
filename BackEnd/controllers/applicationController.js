import DriveApplication from "../models/DriveApplication.js";
import Drive from "../models/Drive.js";
import Notification from "../models/Notification.js";

// POST /api/applications/apply/:driveId
export async function applyForDrive(req, res) {
  try {
    const { driveId } = req.params;
    const userId = req.user._id;

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    const existing = await DriveApplication.findOne({ userId, driveId });
    if (existing)
      return res
        .status(400)
        .json({ message: "Already applied for this drive" });

    const application = await DriveApplication.create({ userId, driveId });

    // Notify admin / placement officers – optional, broadcast can be added here

    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (err) {
    if (err.code === 11000)
      return res
        .status(400)
        .json({ message: "Already applied for this drive" });
    res.status(500).json({ error: err.message });
  }
}

// GET /api/applications/my-applications
export async function getMyApplications(req, res) {
  try {
    const applications = await DriveApplication.find({ userId: req.user._id })
      .populate(
        "driveId",
        "companyName jobRole driveTitle ctc startDate endDate",
      )
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/applications/status/:applicationId  (admin / placement_officer)
export async function updateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowed = ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const application = await DriveApplication.findById(applicationId).populate(
      "driveId",
      "companyName",
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    // Create in-app notification for the student
    const messages = {
      SHORTLISTED: `Congratulations! You've been shortlisted for ${application.driveId?.companyName}.`,
      SELECTED: `🎉 You've been SELECTED for ${application.driveId?.companyName}!`,
      REJECTED: `Your application for ${application.driveId?.companyName} was not selected. Keep trying!`,
      APPLIED: `Your application status was reset to APPLIED.`,
    };

    await Notification.create({
      userId: application.userId,
      message: messages[status],
      type: "STATUS_UPDATE",
      link: `/drives/${application.driveId?._id}`,
    });

    res.json({ message: "Status updated", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/applications/drive/:driveId  (admin / placement officer – see all applicants)
export async function getDriveApplicants(req, res) {
  try {
    const { driveId } = req.params;
    const applicants = await DriveApplication.find({ driveId })
      .populate("userId", "name email branch cgpa phone")
      .sort({ createdAt: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
