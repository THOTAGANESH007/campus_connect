import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
protect → checks that the user is logged in (valid JWT in cookies).
authorizeRoles → checks that the user's role is in the allowed list.
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

/**
 * authorizeRoles(...roles)
 * Usage:  router.post("/", protect, authorizeRoles("ADMIN","PLACEMENT_OFFICER"), handler)
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}.`,
      });
    }
    next();
  };
}
