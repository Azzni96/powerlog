import express from "express";
import {
  fetchFormQuestions,
  addFormQuestion,
  editFormQuestion,
  removeFormQuestion
} from "../controller/formsQuestionsController";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = express.Router();

router.get("/", authenticate, fetchFormQuestions);
router.post("/", authenticate, isAdmin, addFormQuestion);
router.put("/:id", authenticate, isAdmin, editFormQuestion);
router.delete("/:id", authenticate, isAdmin, removeFormQuestion);

export default router;
