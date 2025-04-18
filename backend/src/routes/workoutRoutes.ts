import express from "express";
import {
  fetchWorkouts,
  assignUserWorkouts,
  completeWorkout,
  removeWorkout,
} from "../controller/workoutController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/workouts", authenticate, fetchWorkouts);
router.post("/workouts", authenticate, assignUserWorkouts);
router.put("/workouts/:id/done", authenticate, completeWorkout);
router.delete("/workouts/:id", authenticate, removeWorkout);

export default router;
