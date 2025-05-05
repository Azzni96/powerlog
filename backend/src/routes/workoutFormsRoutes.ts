import express from "express";
import {
  fetchWorkoutForms,
  addWorkoutForm,
  modifyWorkoutForm,
  removeWorkoutForm,
} from "../controller/workoutFormsController";
import { authenticate, isAdmin } from "../middleware/authenticate";
import  upload  from "../utils/multerConfig";

const router = express.Router();

router.get("/", authenticate, fetchWorkoutForms);
router.post("/", authenticate,  // ✅ صحيح:
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ])
  , addWorkoutForm);
router.put("/:id", authenticate, // ✅ صحيح:
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ])
  , modifyWorkoutForm);
router.delete("/:id", authenticate,  removeWorkoutForm);

export default router;
