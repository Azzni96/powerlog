import express from "express";
import { signup, login, forgotPassword, resetPassword, fetchUsers, getProfile } from "../controller/usercontroller";
import { authenticate } from "../utils/authenticate";

const router = express.Router();

// Korjattu: annetaan `next` kaikille kutsuille
router.post("/signup", async (req, res) => { await signup(req, res); });
router.post("/login", async (req, res) => { await login(req, res); });
router.post("/forgot-password", async (req, res) => { await forgotPassword(req, res); });
router.post("/reset-password", async (req, res) => { await resetPassword(req, res); });
router.get("/users", async (req, res) => { await fetchUsers(req, res); });
router.get("/profile", authenticate, async (req, res) => { await getProfile(req, res); });

export default router;
