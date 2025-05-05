import { Request, Response } from "express";
import {
  getChoicesByQuestionId,
  addChoice,
  deleteChoice,
} from "../model/formChoicesModel";

/**
 * @api {get} /api/questions/:questionId/choices Get Choices by Question
 * @apiName GetChoicesByQuestion
 * @apiGroup FormChoices
 * @apiDescription Retrieves all answer choices for a specific question.
 *
 * @apiParam {Number} questionId Question ID to get choices for
 *
 * @apiSuccess {Object[]} choices List of answer choices
 * @apiSuccess {Number} choices.id Choice ID
 * @apiSuccess {Number} choices.question_id Question ID
 * @apiSuccess {String} choices.answer_text Answer text content
 *
 * @apiError {Object} error Error message
 */
export const fetchChoices = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const choices = await getChoicesByQuestionId(questionId);
    res.status(200).json(choices);
  } catch (error) {
    console.error("Error fetching choices:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {post} /api/questions/:questionId/choices Add Answer Choice
 * @apiName AddAnswerChoice
 * @apiGroup FormChoices
 * @apiDescription Creates a new answer choice for a specific question.
 *
 * @apiParam {Number} questionId Question ID to add choice to
 *
 * @apiBody {String} answer_text The text content of the answer choice
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 * @apiSuccess {Number} result.id ID of the newly created choice
 *
 * @apiError {Object} error Error message
 */
export const createChoice = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { answer_text } = req.body;
    const id = await addChoice(questionId, answer_text);
    res.status(201).json({ message: "Choice added", id });
  } catch (error) {
    console.error("Error adding choice:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {delete} /api/choices/:id Delete Answer Choice
 * @apiName DeleteAnswerChoice
 * @apiGroup FormChoices
 * @apiDescription Deletes an answer choice.
 *
 * @apiParam {Number} id Choice ID to delete
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const removeChoice = async (req: Request, res: Response) => {
  try {
    const choiceId = parseInt(req.params.id);
    await deleteChoice(choiceId);
    res.status(200).json({ message: "Choice deleted" });
  } catch (error) {
    console.error("Error deleting choice:", error);
    res.status(500).json({ error: "Server error" });
  }
};
