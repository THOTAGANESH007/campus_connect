import User from "../models/User.js";
import Drive from "../models/Drive.js";
import DriveApplication from "../models/DriveApplication.js";

// GET /api/analytics/overview
export async function getOverview(req, res) {
  try {
    const [totalStudents, totalDrives, totalApplications, selectedCount] =
      await Promise.all([
        User.countDocuments({ role: "STUDENT" }),
        Drive.countDocuments(),
        DriveApplication.countDocuments(),
        DriveApplication.countDocuments({ status: "SELECTED" }),
      ]);

    res.json({ totalStudents, totalDrives, totalApplications, selectedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/analytics/by-company  – placements per company
export async function getPlacementsByCompany(req, res) {
  try {
    const data = await DriveApplication.aggregate([
      { $match: { status: "SELECTED" } },
      {
        $lookup: {
          from: "drives",
          localField: "driveId",
          foreignField: "_id",
          as: "drive",
        },
      },
      { $unwind: "$drive" },
      {
        $group: {
          _id: "$drive.companyName",
          count: { $sum: 1 },
          avgCtc: { $first: "$drive.ctc" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/analytics/by-branch  – placements per branch
export async function getPlacementsByBranch(req, res) {
  try {
    const data = await DriveApplication.aggregate([
      { $match: { status: "SELECTED" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $group: {
          _id: "$student.branch",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/analytics/status-distribution
export async function getStatusDistribution(req, res) {
  try {
    const data = await DriveApplication.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
