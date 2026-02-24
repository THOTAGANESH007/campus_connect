import InterviewQuestion from "../models/InterviewQuestion.js";

// @desc   Create a new interview question post
// @route  POST /api/interview-questions
// @access Private
export const createQuestion = async (req, res) => {
    try {
        const {
            company, jobRole, driveYear, roundType,
            difficulty, questionTitle, questionContent,
            answerHint, tags, isAnonymous,
        } = req.body;

        if (!company || !jobRole || !driveYear || !roundType || !difficulty || !questionTitle || !questionContent) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        const question = await InterviewQuestion.create({
            company,
            jobRole,
            driveYear,
            roundType,
            difficulty,
            questionTitle,
            questionContent,
            answerHint: answerHint || "",
            tags: tags || [],
            isAnonymous: isAnonymous || false,
            postedBy: req.user._id,
        });

        const populated = await question.populate("postedBy", "name profile");
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get all interview questions (with search, filter, pagination)
// @route  GET /api/interview-questions
// @access Private
export const getAllQuestions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            company,
            roundType,
            difficulty,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { company: { $regex: search, $options: "i" } },
                { jobRole: { $regex: search, $options: "i" } },
                { questionTitle: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }
        if (company) query.company = { $regex: company, $options: "i" };
        if (roundType) query.roundType = roundType;
        if (difficulty) query.difficulty = difficulty;

        const questions = await InterviewQuestion.find(query)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate("postedBy", "name profile")
            .populate("comments.user", "name profile");

        const count = await InterviewQuestion.countDocuments(query);

        res.status(200).json({
            questions,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Get single interview question by ID
// @route  GET /api/interview-questions/:id
// @access Private
export const getQuestionById = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id)
            .populate("postedBy", "name profile")
            .populate("comments.user", "name profile");

        if (!question) return res.status(404).json({ message: "Question not found." });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Update an interview question
// @route  PUT /api/interview-questions/:id
// @access Private (Owner only)
export const updateQuestion = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found." });

        if (question.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this post." });
        }

        const updatable = ["company", "jobRole", "driveYear", "roundType", "difficulty",
            "questionTitle", "questionContent", "answerHint", "tags", "isAnonymous"];

        updatable.forEach((field) => {
            if (req.body[field] !== undefined) question[field] = req.body[field];
        });

        await question.save();
        const populated = await question.populate("postedBy", "name profile");
        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete an interview question
// @route  DELETE /api/interview-questions/:id
// @access Private (Owner or Admin)
export const deleteQuestion = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found." });

        const isOwner = question.postedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN" || req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this post." });
        }

        await question.deleteOne();
        res.status(200).json({ message: "Question deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Upvote / un-upvote an interview question
// @route  PUT /api/interview-questions/:id/upvote
// @access Private
export const toggleUpvote = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found." });

        const userId = req.user._id.toString();
        const alreadyUpvoted = question.upvotes.map(String).includes(userId);

        if (alreadyUpvoted) {
            question.upvotes = question.upvotes.filter((id) => id.toString() !== userId);
        } else {
            question.upvotes.push(req.user._id);
        }

        await question.save();
        res.status(200).json({ upvotes: question.upvotes.length, upvoted: !alreadyUpvoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Add a comment to an interview question
// @route  POST /api/interview-questions/:id/comments
// @access Private
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment cannot be empty." });
        }

        const question = await InterviewQuestion.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found." });

        question.comments.push({ user: req.user._id, text: text.trim() });
        await question.save();

        const updated = await InterviewQuestion.findById(req.params.id)
            .populate("comments.user", "name profile");

        res.status(201).json(updated.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc   Delete a comment
// @route  DELETE /api/interview-questions/:id/comments/:commentId
// @access Private (Comment owner or Admin)
export const deleteComment = async (req, res) => {
    try {
        const question = await InterviewQuestion.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found." });

        const comment = question.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });

        const isOwner = comment.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN" || req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized." });
        }

        question.comments.pull(req.params.commentId);
        await question.save();
        res.status(200).json({ message: "Comment deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
