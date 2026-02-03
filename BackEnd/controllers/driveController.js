import Drive from "../models/Drive.js";

// Validation helper
const validateDriveDates = (data) => {
    if (new Date(data.registrationDeadline) > new Date(data.startDate)) {
        throw new Error("Registration deadline must be before or on the start date.");
    }
    if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new Error("End date must be after or on the start date.");
    }
};

// @desc    Create a new drive
// @route   POST /api/drives
// @access  Private
export const createDrive = async (req, res) => {
    try {
        validateDriveDates(req.body);

        const drive = new Drive({
            ...req.body,
            createdBy: req.user._id,
        });

        const savedDrive = await drive.save();
        res.status(201).json(savedDrive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all drives with search, filter, sort, pagination
// @route   GET /api/drives
// @access  Private
export const getAllDrives = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            jobType,
            sortBy = "startDate",
            sortOrder = "asc",
        } = req.query;

        const query = {};

        // Search by companyName or jobRole
        if (search) {
            query.$or = [
                { companyName: { $regex: search, $options: "i" } },
                { jobRole: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by jobType
        if (jobType) {
            query.jobType = jobType;
        }

        const drives = await Drive.find(query)
            .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("createdBy", "name email");

        const count = await Drive.countDocuments(query);

        res.status(200).json({
            drives,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single drive
// @route   GET /api/drives/:id
// @access  Private
export const getDriveById = async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );
        if (!drive) {
            return res.status(404).json({ message: "Drive not found" });
        }
        res.status(200).json(drive);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update drive
// @route   PUT /api/drives/:id
// @access  Private (Creator or Admin)
export const updateDrive = async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({ message: "Drive not found" });
        }

        // Check authorization: only creator or admin
        if (
            drive.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin" &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Not authorized to update this drive" });
        }

        // Run date validations if dates are being updated
        if (req.body.registrationDeadline || req.body.startDate || req.body.endDate) {
            // Merge existing data with updates to check consistency if some fields are missing in body
            // But simpler to just check if they are present in body
            const mergedData = { ...drive.toObject(), ...req.body };
            validateDriveDates(mergedData);
        }

        const updatedDrive = await Drive.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedDrive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete drive
// @route   DELETE /api/drives/:id
// @access  Private (Creator or Admin)
export const deleteDrive = async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({ message: "Drive not found" });
        }

        // Check authorization: only creator or admin
        if (
            drive.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin" &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Not authorized to delete this drive" });
        }

        await drive.deleteOne();
        res.status(200).json({ message: "Drive deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
