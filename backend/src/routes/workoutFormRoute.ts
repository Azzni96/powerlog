import express from "express";
import { authenticate, isAdmin } from "../middleware/authenticate";
import {
  createWorkoutFormController,
  getWorkoutFormsController,
  updateWorkoutFormController,
  deleteWorkoutFormController,
} from "../controller/workoutFormController";

const router = express.Router();

router.use(authenticate);
router.post("/create", isAdmin, createWorkoutFormController);
router.get("/", getWorkoutFormsController);
router.put("/update", isAdmin, updateWorkoutFormController);
router.delete("/delete/:id", isAdmin, deleteWorkoutFormController);

export default router;

