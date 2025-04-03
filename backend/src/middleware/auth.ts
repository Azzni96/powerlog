import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Add user property to Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Get JWT_SECRET from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token from Bearer format
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
