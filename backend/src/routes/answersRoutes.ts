import express from "express";
import {
  fetchAnswers,
  submitAnswers,
  clearAnswers,
} from "../controller/answersController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/user-answers", authenticate, fetchAnswers);
router.post("/user-answers", authenticate, submitAnswers);
router.delete("/user-answers", authenticate, clearAnswers);

export default router;
