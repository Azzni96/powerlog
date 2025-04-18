import express from "express";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../controller/profileController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/profile", authenticate, getUserProfile);
router.post("/profile", authenticate, createUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.delete("/profile", authenticate, deleteUserProfile);

export default router;
