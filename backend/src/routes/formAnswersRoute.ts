import express from "express";
import { authenticate } from "../utils/authenticate";
import {
  createFormAnswerController,
  getAnswersByUserController
} from "../controller/formAnswersController";

const router = express.Router();

router.use(authenticate);
router.post("/create", createFormAnswerController);
router.get("/:user_id", getAnswersByUserController);

export default router;