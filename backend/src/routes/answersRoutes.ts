import express from "express";
import {
  fetchAnswers,
  submitAnswers,
  clearAnswers,
} from "../controller/answersController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, fetchAnswers);
router.post("/", authenticate, submitAnswers);
router.delete("/", authenticate, clearAnswers);

export default router;
