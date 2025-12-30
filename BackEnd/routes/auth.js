import express from "express";
import {
  forgotPassword,
  resetForgotPassword,
  signin,
  signout,
  signup,
  updateUserDetails,
  uploadProfile,
  verifyForgotPasswordOtp,
} from "../controllers/auth.js";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/auth.js";

const auth = express.Router();

// Authentication Routes
auth.post(
  "/signup",
  //[body("role").isIn(["PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"])],
  signup
);
auth.post("/signin", signin);
auth.post("/signout", signout);

// User Profile Routes
auth.put("/update-user", protect, updateUserDetails);

// Profile Image Upload Route
auth.put("/upload-profile", protect, upload.single("image"), uploadProfile);

// Forgot and Reset Password Routes
auth.put("/forgot-password", forgotPassword);
auth.put("/verify-forgot-password-otp", verifyForgotPasswordOtp);
auth.put("/reset-password", resetForgotPassword);

export default auth;
