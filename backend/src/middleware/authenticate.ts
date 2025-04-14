import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("SECRET_KEY is not set");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token missing" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; user_level: string };
    (req as any).user = decoded;
    next();
    } catch (error) {
    res.status(401).json({ error: "Token invalid" });
    return;
    }
};

export const isAdmin = async ( req: Request, res: Response, next: NextFunction): Promise<void> => 
{
  if ((req as any).user.user_level === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}
    