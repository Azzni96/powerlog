import { Request, Response } from 'express';
import { FormQuestionModel } from '../model/formsQuestionModel';

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await FormQuestionModel.getAll();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { category, question, max, answer } = req.body;
    await FormQuestionModel.create({ category, question, max, answer });
    res.status(201).json({ message: 'Question created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating question' });
  }
};
