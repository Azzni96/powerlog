import express from "express";
import {
  fetchWorkoutForms,
  addWorkoutForm,
  modifyWorkoutForm,
  removeWorkoutForm,
} from "../controller/workoutFormsController";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, fetchWorkoutForms);
router.post("/", authenticate, isAdmin, addWorkoutForm);
router.put("/:id", authenticate, isAdmin, modifyWorkoutForm);
router.delete("/:id", authenticate, isAdmin, removeWorkoutForm);

export default router;
