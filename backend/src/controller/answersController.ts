import { Request, Response } from "express";
import {
  getUserAnswers,
  saveAllAnswers,
  deleteUserAnswers,
} from "../model/answersModel";
import pool from "../database/db";

// GET all answers
export const fetchAnswers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const answers = await getUserAnswers(userId);
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST save all answers
export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const answers = req.body.answers;

    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: "Answers are required" });
    }

    await saveAllAnswers(userId, answers);
    res.status(200).json({ message: "Answers saved successfully" });
  } catch (error) {
    console.error("Error saving answers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE all answers
export const clearAnswers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await deleteUserAnswers(userId);
    res.status(200).json({ message: "Answers cleared" });
  } catch (error) {
    console.error("Error clearing answers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET all possible answer choices (not user answers)
export const fetchFormChoices = async (req: Request, res: Response) => {
  try {
    console.log("Fetching all possible answer choices");
    const conn = await pool.getConnection();

    // Get all predefined choices from FormsAnswers table
    const [rows] = await conn.query(
      "SELECT id, question_id, answer_text FROM FormsAnswers ORDER BY question_id, id"
    );

    console.log(`Found ${rows.length} possible answer choices`);
    conn.release();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching form choices:", error);
    res.status(500).json({ error: "Server error" });
  }
};
