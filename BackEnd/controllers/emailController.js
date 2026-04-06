import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// GET /api/emails/students
export async function getStudentsList(req, res) {
  try {
    const students = await User.find({ role: "STUDENT" })
      .select("_id name email branch")
      .sort({ name: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/emails/send
export async function sendMailAction(req, res) {
  try {
    const { target, subject, html } = req.body;

    if (!target || !subject || !html) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let recipients = [];

    if (target === "ALL") {
      const users = await User.find({ role: "STUDENT" }).select("email");
      recipients = users.map((u) => u.email);
    } else {
      // target is a specific email string (or comma separated string of emails)
      recipients = [target];
    }

    if (recipients.length === 0) {
      return res.status(404).json({ message: "No valid recipients found" });
    }

    // Gmail limits apply, but for a college scope, joining them via bcc or passing chunked promises is best.
    await sendEmail({
      to: process.env.USEREMAIL, // Send to self
      bcc: recipients.join(","),
      subject,
      html
    });

    res.status(200).json({ message: `Mail sent successfully to ${recipients.length} recipients.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
