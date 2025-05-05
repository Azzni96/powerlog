import { Request, Response } from "express";
import {
  getUserAnswers,
  saveAllAnswers,
  deleteUserAnswers,
} from "../model/answersModel";
import pool from "../database/db";

/**
 * @api {get} /api/answers Get User Answers
 * @apiName GetUserAnswers
 * @apiGroup Answers
 * @apiDescription Retrieves all answers submitted by the authenticated user.
 *
 * @apiSuccess {Object[]} answers List of user answers
 * @apiSuccess {Number} answers.id Answer ID
 * @apiSuccess {Number} answers.question_id Question ID
 * @apiSuccess {Number} answers.answer_id Answer ID
 * @apiSuccess {Number} answers.user_id User ID
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {post} /api/answers Submit User Answers
 * @apiName SubmitUserAnswers
 * @apiGroup Answers
 * @apiDescription Saves multiple answers for the authenticated user.
 *
 * @apiBody {Object[]} answers Array of answer objects
 * @apiBody {Number} answers.question_id Question ID
 * @apiBody {Number} answers.answer_id Answer ID
 *
 * @apiSuccess {Object} result Result message
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {delete} /api/answers Clear User Answers
 * @apiName ClearUserAnswers
 * @apiGroup Answers
 * @apiDescription Deletes all answers for the authenticated user.
 *
 * @apiSuccess {Object} result Result message
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {get} /api/answers/choices Get Answer Choices
 * @apiName GetAnswerChoices
 * @apiGroup Answers
 * @apiDescription Retrieves all predefined answer choices available in the system.
 *
 * @apiSuccess {Object[]} choices List of answer choices
 * @apiSuccess {Number} choices.id Answer choice ID
 * @apiSuccess {Number} choices.question_id Question ID
 * @apiSuccess {String} choices.answer_text Answer text content
 *
 * @apiError {Object} error Error message
 */
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
