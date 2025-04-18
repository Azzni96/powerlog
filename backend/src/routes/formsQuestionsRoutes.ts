import express from "express";
import {
  fetchFormQuestions,
  addFormQuestion,
  editFormQuestion,
  removeFormQuestion
} from "../controller/formsQuestionsController";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = express.Router();

router.get("/form-questions", authenticate, fetchFormQuestions);
router.post("/form-questions", authenticate, isAdmin, addFormQuestion);
router.put("/form-questions/:id", authenticate, isAdmin, editFormQuestion);
router.delete("/form-questions/:id", authenticate, isAdmin, removeFormQuestion);

export default router;
