import express from "express";
import {
  fetchFood,
  addFood,
  editFood,
  removeFood
} from "../controller/foodController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, fetchFood);
router.post("/", authenticate, addFood);
router.put("/:id", authenticate, editFood);
router.delete("/:id", authenticate, removeFood);

export default router;
