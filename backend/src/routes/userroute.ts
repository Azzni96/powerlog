import express, { Request, Response } from "express"; // Add Request and Response types
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  fetchUsers,
  getProfile,
} from "../controller/usercontroller";
import { getUserById } from "../model/usermodel"; // Add this import
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Korjattu: annetaan `next` kaikille kutsuille
router.post("/signup", async (req, res) => {
  await signup(req, res);
});
router.post("/login", async (req, res) => {
  await login(req, res);
});
router.post("/forgot-password", async (req, res) => {
  await forgotPassword(req, res);
});
router.post("/reset-password", async (req, res) => {
  await resetPassword(req, res);
});
router.get("/users", async (req, res) => {
  await fetchUsers(req, res);
});
router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  try {
    // The user ID should be available from the auth middleware
    const userId = req.user?.id; // Use optional chaining to handle undefined user
    console.log("Fetching profile for user ID:", userId);

    const user = await getUserById(userId);
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user data (excluding password)
    res.json({
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email,
        user_level: user.User_level,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
