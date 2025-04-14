import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getAllUsers,
  createUser,
  getUserByEmail,
  updateUserPassword,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser
} from "../model/usermodel";
import { sendEmail } from "../utils/emailService";
import dotenv from "dotenv";
import pool from "../database/db";

dotenv.config();

const SALT_ROUNDS = 10;
if (!process.env.JWT_SECRET) {
  throw new Error("SECRET_KEY is not set");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup request received:", req.body); // Log the incoming request body

    const { name, email, password, confirm_password, user_level } = req.body;

    if (!name || !email || !password || !confirm_password) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirm_password) {
      console.log("Validation failed: Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const validUserLevels = ["admin", "restaurant_owner", "customer"];
    const level = validUserLevels.includes(user_level)
      ? user_level
      : "customer";
    console.log("Resolved user level:", level);

    console.log("Checking if user exists with email:", email);
    const existingUser = await getUserByEmail(email);
    console.log("Existing user check result:", existingUser);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("Checking if user exists with name:", name);
    const existingUserByName = await getUserByName(name);
    console.log("Existing user by name:", existingUserByName);
    if (existingUserByName) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Hashed password generated");

    console.log("Creating user with data:", {
      name,
      email,
      password: hashedPassword,
      user_level: level,
    });
    await createUser({
      name,
      email,
      password: hashedPassword,
      user_level: level,
    });

    console.log("User created successfully");
    res.status(201).json({ message: "User account created successfully" });
  } catch (error) {
    console.error("ERROR IN SIGNUP:", error);
    console.error("Stack trace:", (error as Error).stack);
    res.status(500).json({
      error: "Something went wrong",
      details: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { name_email, password } = req.body;

    if (!name_email || !password) {
      return res
        .status(400)
        .json({ error: "Email/username and password are required" });
    }

    const user = await getUserByNameOrEmail(name_email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.Id, // Make sure this is correct case
        username: user.Username,
        email: user.Email,
        user_level: user.User_level,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email,
        user_level: user.User_level,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUserByNameOrEmail = async (nameOrEmail: string) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM users WHERE Username = ? OR Email = ?",
      [nameOrEmail, nameOrEmail]
    );
    conn.release();
    return result[0];
  } catch (error) {
    console.error("Error in getUserByNameOrEmail:", error);
    throw error;
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }
    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Password Reset Request",
      `Hi ${user.name},\n\nYou requested to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`
    );
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
    await updateUserPassword(decoded.email, hashedPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      user_level: user.user_level,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { username, email} = req.body;

    await updateUser(userId, { username, email });
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Failed to update user information" });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    await deleteUser(userId);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Failed to delete user account" });
  }
}