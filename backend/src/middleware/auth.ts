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

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return; // Don't return the response object, just return from function
    }

    // Extract token from Bearer format
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return; // Don't return the response object
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next(); // Call next to continue
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
    // No return statement here
  }
};