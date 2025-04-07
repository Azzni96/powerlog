import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("SECRET_KEY is not set");
}
const JWT_SECRET = process.env.JWT_SECRET;

// Add user property to Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // Extract token from Bearer format
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; user_level: string };
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.user_level === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};