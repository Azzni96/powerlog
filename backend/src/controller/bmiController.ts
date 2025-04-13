import { Request, Response } from 'express';
import { BmiModel } from '../model/bmimodel';

export const getUserBmi = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const bmiData = await BmiModel.getByUserId(user_id);
    res.status(200).json(bmiData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch BMI records' });
  }
};

export const createBmi = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const { weight, height } = req.body;

    if (!weight || !height) {
       res.status(400).json({ error: 'Missing weight or height' });
    }

    await BmiModel.create({ user_id, weight, height });

    // Calculate BMI value
    const bmi_value = Number((weight / (height * height)).toFixed(2));

    res.status(201).json({
      message: 'BMI recorded successfully',
      data: { weight, height, bmi_value },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record BMI' });
  }
};
