import express from "express";
import {
  fetchChoices,
  createChoice,
  removeChoice
} from "../controller/formChoicesController";
import { authenticate, isAdmin } from "../middleware/authenticate";

const router = express.Router();

router.get("/form-choices/:questionId", authenticate, fetchChoices);
router.post("/form-choices/:questionId", authenticate, isAdmin, createChoice);
router.delete("/form-choices/:id", authenticate, isAdmin, removeChoice);

export default router;
