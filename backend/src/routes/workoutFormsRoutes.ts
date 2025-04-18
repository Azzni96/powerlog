import express from "express";
import {
  fetchWorkoutForms,
  addWorkoutForm,
  modifyWorkoutForm,
  removeWorkoutForm,
} from "../controller/workoutFormsController";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = express.Router();

router.get("/workout-forms", authenticate, fetchWorkoutForms);
router.post("/workout-forms", authenticate, isAdmin, addWorkoutForm);
router.put("/workout-forms/:id", authenticate, isAdmin, modifyWorkoutForm);
router.delete("/workout-forms/:id", authenticate, isAdmin, removeWorkoutForm);

export default router;
