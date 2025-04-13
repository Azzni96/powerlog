import { Request, Response } from 'express';
import { FormAnswerModel } from '../model/formAnswerModel';

export const getUserAnswers = async (req: Request, res: Response) => {
  try {
    const userId = Number((req as any).user?.id);
    const answers = await FormAnswerModel.getByUserId(userId);
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user answers' });
  }
};

export const createFormAnswer = async (req: Request, res: Response) => {
  try {
    const { form_question_id, Answer } = req.body;
    const user_id = (req as any).user?.id;

    if (!user_id || !form_question_id || !Answer) {
       res.status(400).json({ error: 'Missing required fields' });
    }

    await FormAnswerModel.create({ user_id, form_question_id, Answer });

    res.status(201).json({ message: 'Answer saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving answer' });
  }
};
