import { Request, Response } from 'express';
import { FormsAnswerModel } from '../model/formsAnswerModel';

export const getAnswersByQuestion = async (req: Request, res: Response) => {
  try {
    const questionId = Number(req.params.questionId);
    const answers = await FormsAnswerModel.getByQuestionId(questionId);
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching answers' });
  }
};

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { question_id, answer_text } = req.body;
    await FormsAnswerModel.create({ question_id, answer_text });
    res.status(201).json({ message: 'Answer option created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating answer option' });
  }
};

export const updateAnswer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { answer_text } = req.body;

    await FormsAnswerModel.update(id, answer_text);
    res.status(200).json({ message: 'Answer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update answer' });
  }
};

export const deleteAnswer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await FormsAnswerModel.delete(id);
    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete answer' });
  }
};
