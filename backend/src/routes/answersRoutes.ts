import express from "express";
import {
  fetchAnswers,
  submitAnswers,
  clearAnswers,
  fetchFormChoices,
} from "../controller/answersController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, fetchAnswers);
router.get("/choices", authenticate, fetchFormChoices);
router.post("/", authenticate, submitAnswers);
router.delete("/", authenticate, clearAnswers);

export default router;
