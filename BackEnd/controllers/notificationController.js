import Notification from "../models/Notification.js";
import User from "../models/User.js";

// GET /api/notifications  – get current user's notifications
export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/notifications/mark-read/:id
export async function markRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /api/notifications/mark-all-read
export async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/notifications/send  – admin broadcasts to all or specific user
export async function sendNotification(req, res) {
  try {
    const { message, type, targetUserId, link } = req.body;

    if (targetUserId) {
      // Send to one user
      const notif = await Notification.create({
        userId: targetUserId,
        message,
        type: type || "GENERAL",
        link: link || "",
      });
      return res.status(201).json({ message: "Notification sent", notif });
    }

    // Broadcast to all users
    const users = await User.find({}, "_id");
    const docs = users.map((u) => ({
      userId: u._id,
      message,
      type: type || "GENERAL",
      link: link || "",
    }));
    await Notification.insertMany(docs);
    res.status(201).json({ message: `Broadcast sent to ${docs.length} users` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
