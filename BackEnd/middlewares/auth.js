import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
protect → checks that the user is logged in (valid JWT in cookies).
authorize → checks that the user’s role is allowed to access that route.
*/

export async function protect(req, res, next) {
  try {
    const token =
      req.cookies.auth_token || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "Not authorized, Please Login!!!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password_hash");
    if (!user)
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });

    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Not authorized, invalid token", error: err.message });
  }
}
