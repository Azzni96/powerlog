import express from "express";
import {
  fetchFood,
  addFood,
  editFood,
  removeFood
} from "../controller/foodController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/food", authenticate, fetchFood);
router.post("/food", authenticate, addFood);
router.put("/food/:id", authenticate, editFood);
router.delete("/food/:id", authenticate, removeFood);

export default router;
