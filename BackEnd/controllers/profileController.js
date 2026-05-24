import User from "../models/User.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

// GET /api/profile/me
export async function getMyProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password_hash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/profile/update
export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { name, phone, cgpa, branch, skills } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (cgpa !== undefined && cgpa !== "") updateData.cgpa = Number(cgpa);
    if (branch) updateData.branch = branch;
    if (skills) {
      // skills can arrive as JSON string or array
      updateData.skills = Array.isArray(skills)
        ? skills
        : skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    const updated = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password_hash");

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/profile/upload-resume  (uses multer — raw file buffer)
export async function uploadResume(req, res) {
  try {
    const userId = req.user._id;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const upload = await uploadImageCloudinary(file); // Cloudinary also accepts pdfs
    const updated = await User.findByIdAndUpdate(
      userId,
      { resume: upload.url },
      { new: true },
    ).select("-password_hash");

    res.json({ message: "Resume uploaded", resume: upload.url, user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/profile/bookmark/:type/:id  – toggle bookmark
// type: drives | questions | materials
export async function toggleBookmark(req, res) {
  try {
    const { type, id } = req.params;
    const userId = req.user._id;

    const fieldMap = {
      drives: "savedDrives",
      questions: "savedQuestions",
      materials: "savedMaterials",
      posts: "savedPosts",
    };
    const field = fieldMap[type];
    if (!field)
      return res.status(400).json({ message: "Invalid bookmark type" });

    const user = await User.findById(userId);
    const arr = user[field].map((x) => x.toString());
    const idx = arr.indexOf(id);

    if (idx === -1) {
      user[field].push(id);
    } else {
      user[field].splice(idx, 1);
    }
    await user.save();

    const saved = idx === -1;
    res.json({
      message: saved ? "Bookmarked" : "Removed",
      saved,
      [field]: user[field],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/profile/bookmarks
export async function getBookmarks(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedDrives", "companyName jobRole driveTitle ctc startDate")
      .populate("savedQuestions", "questionTitle company tags difficulty")
      .populate("savedMaterials", "title category materialType resourceUrl")
      .populate("savedPosts", "title content category createdAt userId")
      .select("savedDrives savedQuestions savedMaterials savedPosts");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
