
import { Request, Response } from "express";
import {
  createFormAnswer,
  getAnswersByUser,
  FormAnswer
} from "../model/formAnswersModel";

export const createFormAnswerController = async (req: Request, res: Response) => {
  try {
    const answer: FormAnswer = req.body;
    await createFormAnswer(answer);
    res.status(201).json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAnswersByUserController = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.user_id);
    const answers = await getAnswersByUser(userId);
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
