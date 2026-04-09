import PlacementStats from "../models/PlacementStats.js";
import StudentPlacement from "../models/StudentPlacement.js";
import xlsx from "xlsx";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import mongoose from "mongoose";

// @desc    Upload placement data excel and parse it
// @route   POST /api/placements/upload
// @access  Private (Placement Officer / Admin)
export const uploadPlacementData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { batchName } = req.body;
    const file = req.file;

    if (!batchName || !file) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Batch name and Excel file are required." });
    }

    // Check if batch already exists
    const existingBatch = await PlacementStats.findOne({ batchName });
    if (existingBatch) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Placement data for this batch already exists." });
    }

    // 1. Upload to Cloudinary
    const uploadResult = await uploadImageCloudinary(file, "PlacementData", {
      resource_type: "raw",
      public_id: `placement_report_${batchName.replace(/\s+/g, '_')}_${Date.now()}.xlsx`
    });
    const fileUrl = uploadResult.secure_url;

    // 2. Parse Excel from buffer
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Get raw data
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    if (rows.length <= 1) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "The uploaded file is empty or missing data." });
    }

    // 3. Process records and calculate summary
    const studentRecords = [];
    let placedCount = 0;
    let unplacedCount = 0;
    let totalPackage = 0;
    let highestPackage = 0;
    const branchStats = {}; // { BRANCH: { total: 0, placed: 0 } }

    // Header validation (Expected: studentId, name, branch, company, role, package, placementStatus, cgpa)
    const headers = rows[0].map(h => h?.toString().toLowerCase().trim());
    const expectedHeaders = ["studentid", "name", "branch", "company", "role", "package", "placementstatus", "cgpa"];
    
    // Create first the batch record to get the ID
    const newBatch = new PlacementStats({
        batchName,
        fileUrl,
        uploadedBy: req.user._id,
        summary: { totalStudents: 0 } // placeholder
    });
    await newBatch.save({ session });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[0]) continue; 

      const studentId = row[0]?.toString().trim();
      const name = row[1]?.toString().trim();
      let branch = (row[2]?.toString().trim() || "OTHER").toUpperCase();
      let company = row[3]?.toString().trim() || null;
      let role = row[4]?.toString().trim() || "N/A";
      let pkg = parseFloat(row[5]) || 0;
      let status = row[6]?.toString().trim();
      let cgpa = parseFloat(row[7]) || 0;

      // Normalization
      if (!["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].includes(branch)) {
          branch = "OTHER";
      }

      // Feature 1 Validation: If placementStatus = "Not Placed": company = null, package = 0
      const isPlaced = status?.toLowerCase() === "placed";
      const finalStatus = isPlaced ? "Placed" : "Not Placed";
      if (!isPlaced) {
          company = null;
          pkg = 0;
      }

      if (!studentId || !name) continue;

      studentRecords.push({
        batchId: newBatch._id,
        studentId,
        name,
        branch,
        company,
        role,
        package: pkg,
        placementStatus: finalStatus,
        cgpa
      });

      // Update counters for summary
      if (isPlaced) {
        placedCount++;
        totalPackage += pkg;
        if (pkg > highestPackage) highestPackage = pkg;
      } else {
        unplacedCount++;
      }

      if (!branchStats[branch]) branchStats[branch] = { total: 0, placed: 0 };
      branchStats[branch].total++;
      if (isPlaced) branchStats[branch].placed++;
    }

    if (studentRecords.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "No valid placement records found." });
    }

    // Bulk Insert Records
    await StudentPlacement.insertMany(studentRecords, { session });

    // Update Summary in Batch
    const averagePackage = placedCount > 0 ? parseFloat((totalPackage / placedCount).toFixed(2)) : 0;
    const branchWiseStats = {};
    Object.keys(branchStats).forEach(b => {
        branchWiseStats[b] = parseFloat(((branchStats[b].placed / branchStats[b].total) * 100).toFixed(1));
    });

    newBatch.summary = {
        totalStudents: studentRecords.length,
        placedCount,
        unplacedCount,
        averagePackage,
        highestPackage,
        branchWiseStats
    };
    await newBatch.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Placement data uploaded and processed successfully.",
      count: studentRecords.length,
      batchId: newBatch._id
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Error processing upload.", error: error.message });
  }
};

// @desc    Get all batches summary
export const getBatches = async (req, res) => {
  try {
    const batches = await PlacementStats.find({}).sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches." });
  }
};

// @desc    Get specific batch detail (including records)
export const getBatchDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await PlacementStats.findById(id);
    if (!batch) return res.status(404).json({ message: "Batch not found." });

    const records = await StudentPlacement.find({ batchId: id });
    
    res.status(200).json({
        ...batch.toObject(),
        records
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching batch details." });
  }
};

// --- ANALYTICS APIS ---

// @desc    Get Summary Statistics across all batches or selected batch
export const getSummaryStats = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = batchId ? { batchId: new mongoose.Types.ObjectId(batchId) } : {};

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    placedCount: { 
                        $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } 
                    },
                    unplacedCount: { 
                        $sum: { $cond: [{ $eq: ["$placementStatus", "Not Placed"] }, 1, 0] } 
                    },
                    avgPackage: { $avg: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, "$package", null] } },
                    maxPackage: { $max: "$package" }
                }
            }
        ]);

        const result = stats[0] || { totalStudents: 0, placedCount: 0, unplacedCount: 0, avgPackage: 0, maxPackage: 0 };
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats." });
    }
};

// @desc    Branch-wise placement stats
export const getBranchStats = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = batchId ? { batchId: new mongoose.Types.ObjectId(batchId) } : {};

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$branch",
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } }
                }
            },
            {
                $project: {
                    branch: "$_id",
                    placementPercentage: { 
                        $multiply: [{ $divide: ["$placed", "$total"] }, 100] 
                    }
                }
            },
            { $sort: { placementPercentage: -1 } }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branch stats." });
    }
};

// @desc    Company-wise hiring stats
export const getCompanyStats = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = { 
            placementStatus: "Placed",
            company: { $ne: null }
        };
        if (batchId) match.batchId = new mongoose.Types.ObjectId(batchId);

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$company",
                    count: { $sum: 1 },
                    avgPackage: { $avg: "$package" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching company stats." });
    }
};

// @desc    Package distribution
export const getPackageDistribution = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = { placementStatus: "Placed" };
        if (batchId) match.batchId = new mongoose.Types.ObjectId(batchId);

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $bucket: {
                    groupBy: "$package",
                    boundaries: [0, 5, 10, 20, 100],
                    default: "20+",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        const mapping = {
            0: "0-5 LPA",
            5: "5-10 LPA",
            10: "10-20 LPA",
            20: "20+ LPA"
        };

        const result = stats.map(s => ({
            range: mapping[s._id] || "20+ LPA",
            count: s.count
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching package distribution." });
    }
};

// @desc    CGPA Analytics
export const getCGPAStats = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = batchId ? { batchId: new mongoose.Types.ObjectId(batchId) } : {};

        // 1. CGPA vs Placement (Bar Chart Data)
        const placementByCGPA = await StudentPlacement.aggregate([
            { $match: match },
            {
                $bucket: {
                    groupBy: "$cgpa",
                    boundaries: [0, 6, 7, 8, 10.1],
                    default: "8+",
                    output: {
                        total: { $sum: 1 },
                        placed: { $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } }
                    }
                }
            }
        ]);

        // 2. CGPA vs Package (Scatter Plot Data - Limit to 1000 for frontend performance)
        const cgpaVsPackage = await StudentPlacement.find(
            { ...match, placementStatus: "Placed" },
            "cgpa package name"
        ).limit(1000);

        res.status(200).json({
            placementByCGPA,
            cgpaVsPackage
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching CGPA stats." });
    }
};

// @desc    Get dynamic insights
export const getInsights = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = batchId ? { batchId: new mongoose.Types.ObjectId(batchId) } : {};

        const insights = [];

        // Highest branch
        const branchStats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$branch",
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } }
                }
            },
            {
                $project: {
                    branch: "$_id",
                    percentage: { $multiply: [{ $divide: ["$placed", "$total"] }, 100] }
                }
            },
            { $sort: { percentage: -1 } },
            { $limit: 1 }
        ]);

        if (branchStats[0]) {
            insights.push(`${branchStats[0].branch} has the highest placement rate of ${branchStats[0].percentage.toFixed(1)}%`);
        }

        // Top Company
        const topCompany = await StudentPlacement.aggregate([
            { $match: { ...match, placementStatus: "Placed" } },
            { $group: { _id: "$company", avgPkg: { $avg: "$package" } } },
            { $sort: { avgPkg: -1 } },
            { $limit: 1 }
        ]);

        if (topCompany[0]) {
            insights.push(`${topCompany[0]._id} offers the highest average package of ${topCompany[0].avgPkg.toFixed(1)} LPA`);
        }

        // CGPA Insight
        const highCGPA = await StudentPlacement.aggregate([
            { $match: { ...match, cgpa: { $gte: 8 } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } }
                }
            }
        ]);

        if (highCGPA[0]) {
            const perc = (highCGPA[0].placed / highCGPA[0].total) * 100;
            insights.push(`Students with CGPA > 8 have a ${perc.toFixed(1)}% placement success rate`);
        }

        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insights." });
    }
};

// @desc    Job Role distribution
export const getRoleDistribution = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = { 
            placementStatus: "Placed",
            role: { $ne: null, $ne: "N/A" }
        };
        if (batchId) match.batchId = new mongoose.Types.ObjectId(batchId);

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching role distribution." });
    }
};

// @desc    Branch Efficiency Analytics
export const getBranchEfficiency = async (req, res) => {
    try {
        const { batchId } = req.query;
        const match = batchId ? { batchId: new mongoose.Types.ObjectId(batchId) } : {};

        const stats = await StudentPlacement.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$branch",
                    totalStudents: { $sum: 1 },
                    placedCount: { 
                        $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, 1, 0] } 
                    },
                    totalPackage: { 
                        $sum: { $cond: [{ $eq: ["$placementStatus", "Placed"] }, "$package", 0] } 
                    }
                }
            },
            {
                $project: {
                    branch: "$_id",
                    totalStudents: 1,
                    placedCount: 1,
                    placementPercentage: { 
                        $multiply: [{ $divide: ["$placedCount", "$totalStudents"] }, 100] 
                    },
                    avgPackage: {
                        $cond: [
                            { $gt: ["$placedCount", 0] },
                            { $divide: ["$totalPackage", "$placedCount"] },
                            0
                        ]
                    }
                }
            }
        ]);

        // Calculate Efficiency Score with Normalization
        // Using a scale where 25 LPA is considered 100% score for the package component
        const MAX_PKG_BENCHMARK = 25; 
        
        const result = stats.map(item => {
            const pkgScore = Math.min((item.avgPackage / MAX_PKG_BENCHMARK) * 100, 100);
            const efficiencyScore = (item.placementPercentage * 0.6) + (pkgScore * 0.4);
            
            return {
                ...item,
                efficiencyScore: parseFloat(efficiencyScore.toFixed(2))
            };
        }).sort((a, b) => b.efficiencyScore - a.efficiencyScore);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branch efficiency.", error: error.message });
    }
};
