import Post from "../models/Post.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// GET /api/forum  – list posts (paginated)
export async function getPosts(req, res) {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const filter = category && category !== "ALL" ? { category } : {};
    const posts = await Post.find(filter)
      .populate("userId", "name profile")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Post.countDocuments(filter);
    res.json({ posts, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/forum/:id
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "name profile")
      .populate("comments.userId", "name profile");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/forum
export async function createPost(req, res) {
  try {
    const { title, content, category } = req.body;
    if (!title || !content)
      return res
        .status(400)
        .json({ message: "Title and content are required" });

    const post = await Post.create({
      title,
      content,
      category,
      userId: req.user._id,
    });
    await post.populate("userId", "name profile");
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/forum/:id/comment
export async function addComment(req, res) {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Comment content is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId: req.user._id, content });
    await post.save();

    // --- Notifications ---
    try {
      const interactedUserIds = new Set();
      interactedUserIds.add(post.userId.toString());
      post.comments.forEach(c => interactedUserIds.add(c.userId.toString()));
      interactedUserIds.delete(req.user._id.toString()); // exclude current commenter

      const uniqueIds = Array.from(interactedUserIds);
      if (uniqueIds.length > 0) {
        const usersToNotify = await User.find({ _id: { $in: uniqueIds } }).select("email name");
        
        const commenterName = req.user.name || "A user";
        const subject = `New comment in discussion: ${post.title}`;
        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h3>New comment on a discussion you follow</h3>
            <p><strong>${commenterName}</strong> commented on the post <strong>${post.title}</strong>:</p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
              ${content}
            </blockquote>
            <p>Log back into Campus Connect to continue the discussion!</p>
          </div>
        `;

        usersToNotify.forEach(user => {
          sendEmail({
            to: user.email,
            subject,
            html: htmlContent
          }).catch(err => console.error("Error sending discussion notification email:", err));
        });
      }
    } catch (notificationErr) {
      console.error("Failed to send discussion notifications:", notificationErr);
    }
    // ----------------------

    await post.populate("comments.userId", "name profile");
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/forum/:id/upvote
export async function toggleUpvote(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const idx = post.upvotes.findIndex((id) => id.toString() === userId);
    if (idx === -1) {
      post.upvotes.push(req.user._id);
    } else {
      post.upvotes.splice(idx, 1);
    }
    await post.save();
    res.json({ upvotes: post.upvotes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE /api/forum/:id  (author or admin)
export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.userId.toString() === req.user._id.toString();
    const isAdmin = ["ADMIN", "PLACEMENT_OFFICER"].includes(req.user.role);
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
