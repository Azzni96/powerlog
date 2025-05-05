import { Request, Response } from "express";
import {
  getAllFormQuestions,
  createFormQuestion,
  updateFormQuestion,
  deleteFormQuestion,
} from "../model/formsQuestionsModel";

/**
 * @api {get} /api/questions Get All Form Questions
 * @apiName GetFormQuestions
 * @apiGroup FormsQuestions
 * @apiDescription Retrieves all form questions in the system.
 *
 * @apiSuccess {Object[]} questions List of form questions
 * @apiSuccess {Number} questions.id Question ID
 * @apiSuccess {String} questions.category Question category
 * @apiSuccess {String} questions.question Question text content
 *
 * @apiError {Object} error Error message
 */
export const fetchFormQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await getAllFormQuestions();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {post} /api/questions Create Form Question
 * @apiName CreateFormQuestion
 * @apiGroup FormsQuestions
 * @apiDescription Creates a new form question.
 *
 * @apiBody {String} category The category of the question
 * @apiBody {String} question The question text content
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 * @apiSuccess {Number} result.id ID of the newly created question
 *
 * @apiError {Object} error Error message
 */
export const addFormQuestion = async (req: Request, res: Response) => {
  try {
    const { category, question } = req.body;
    const id = await createFormQuestion(category, question);
    res.status(201).json({ message: "Question created", id });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {put} /api/questions/:id Update Form Question
 * @apiName UpdateFormQuestion
 * @apiGroup FormsQuestions
 * @apiDescription Updates an existing form question.
 *
 * @apiParam {Number} id Question ID to update
 *
 * @apiBody {String} category Updated category
 * @apiBody {String} question Updated question text
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const editFormQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { category, question } = req.body;
    await updateFormQuestion(id, category, question);
    res.status(200).json({ message: "Question updated" });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {delete} /api/questions/:id Delete Form Question
 * @apiName DeleteFormQuestion
 * @apiGroup FormsQuestions
 * @apiDescription Deletes a form question.
 *
 * @apiParam {Number} id Question ID to delete
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const removeFormQuestion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteFormQuestion(id);
    res.status(200).json({ message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Server error" });
  }
};
