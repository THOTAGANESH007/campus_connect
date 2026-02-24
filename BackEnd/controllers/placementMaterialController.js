import PlacementMaterial from "../models/PlacementMaterial.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

// @desc   Create a new placement material post
// @route  POST /api/placement-materials
// @access Private
export const createMaterial = async (req, res) => {
    try {
        const {
            title, description, category, materialType,
            resourceUrl, company, tags,
        } = req.body;

        if (!title || !description || !category || !materialType) {
            return res.status(400).json({ message: "Title, description, category, and materialType are required." });
        }

        // If materialType is Link, resourceUrl is required
        if (materialType === "Link" && !resourceUrl) {
            return res.status(400).json({ message: "Resource URL is required for Link type." });
        }

        let finalUrl = resourceUrl || "";
        let fileName = "";
        let fileSize = 0;

        // Handle file upload (PDF / Notes) via multer + cloudinary
        if (req.file) {
            const uploaded = await uploadImageCloudinary(req.file, "PlacementMaterials");
            finalUrl = uploaded.url;
            fileName = req.file.originalname || "";
            fileSize = req.file.size || 0;
        }

        const material = await PlacementMaterial.create({
            title,
            description,
            category,
            materialType,
            resourceUrl: finalUrl,
            fileName,
            fileSize,
            company: company || "",
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
            postedBy: req.user._id,
        });

        const populated = await material.populate("postedBy", "name profile");
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all placement materials (search, filter, pagination)
// @route  GET /api/placement-materials
// @access Private
export const getAllMaterials = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            materialType,
            company,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }
        if (category) query.category = category;
        if (materialType) query.materialType = materialType;
        if (company) query.company = { $regex: company, $options: "i" };

        const materials = await PlacementMaterial.find(query)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("postedBy", "name profile");

        const count = await PlacementMaterial.countDocuments(query);

        res.status(200).json({
            materials,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single placement material by ID
// @route  GET /api/placement-materials/:id
// @access Private
export const getMaterialById = async (req, res) => {
    try {
        const material = await PlacementMaterial.findById(req.params.id)
            .populate("postedBy", "name profile");

        if (!material) return res.status(404).json({ message: "Material not found." });
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update a placement material
// @route  PUT /api/placement-materials/:id
// @access Private (Owner only)
export const updateMaterial = async (req, res) => {
    try {
        const material = await PlacementMaterial.findById(req.params.id);
        if (!material) return res.status(404).json({ message: "Material not found." });

        if (material.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this material." });
        }

        const updatable = ["title", "description", "category", "materialType", "resourceUrl", "company", "tags"];
        updatable.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "tags" && typeof req.body[field] === "string") {
                    material[field] = req.body[field].split(",").map((t) => t.trim());
                } else {
                    material[field] = req.body[field];
                }
            }
        });

        await material.save();
        const populated = await material.populate("postedBy", "name profile");
        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete a placement material
// @route  DELETE /api/placement-materials/:id
// @access Private (Owner or Admin)
export const deleteMaterial = async (req, res) => {
    try {
        const material = await PlacementMaterial.findById(req.params.id);
        if (!material) return res.status(404).json({ message: "Material not found." });

        const isOwner = material.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN" || req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete." });
        }

        await material.deleteOne();
        res.status(200).json({ message: "Material deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Upvote / un-upvote a placement material
// @route  PUT /api/placement-materials/:id/upvote
// @access Private
export const toggleUpvote = async (req, res) => {
    try {
        const material = await PlacementMaterial.findById(req.params.id);
        if (!material) return res.status(404).json({ message: "Material not found." });

        const userId = req.user._id.toString();
        const alreadyUpvoted = material.upvotes.map(String).includes(userId);

        if (alreadyUpvoted) {
            material.upvotes = material.upvotes.filter((id) => id.toString() !== userId);
        } else {
            material.upvotes.push(req.user._id);
        }

        await material.save();
        res.status(200).json({ upvotes: material.upvotes.length, upvoted: !alreadyUpvoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Increment download count
// @route  PUT /api/placement-materials/:id/download
// @access Private
export const incrementDownload = async (req, res) => {
    try {
        const material = await PlacementMaterial.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );
        if (!material) return res.status(404).json({ message: "Material not found." });
        res.status(200).json({ downloads: material.downloads });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
