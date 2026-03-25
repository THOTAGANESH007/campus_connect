import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dns from "dns";

import auth from "./routes/auth.js";
import driveRoutes from "./routes/driveRoutes.js";
import interviewQuestionRoutes from "./routes/interviewQuestionRoutes.js";
import placementMaterialRoutes from "./routes/placementMaterialRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import connectDB from "./config/connectDB.js";

// Load environment variables
dotenv.config();
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:7777",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Core routes
app.use("/api/auth", auth);
app.use("/api/drives", driveRoutes);
app.use("/api/interview-questions", interviewQuestionRoutes);
app.use("/api/placement-materials", placementMaterialRoutes);

// New feature routes
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB connection error:", err));
