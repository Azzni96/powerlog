import { Request, Response } from 'express';
import { UserProfileModel } from '../model/userProfileModel';

function calculateCalories({
  gender,
  age,
  height,
  weight,
  workout_days,
}: {
  gender: string;
  age: number;
  height: number;
  weight: number;
  workout_days: number;
}): number {
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'male' ? 5 : -161;


  const factor: Record<number, number> = {
    1: 1.2,
    2: 1.3,
    3: 1.4,
    4: 1.5,
    5: 1.6,
    6: 1.7,
    7: 1.8,
  };

  return Math.round(bmr * (factor[workout_days] || 1.2));
}

export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const { gender, age, height, weight, workout_days } = req.body;

    if (!user_id || !gender || !age || !height || !weight || !workout_days) {
       res.status(400).json({ error: 'Missing required fields' });
    }

    const calorie_target = calculateCalories({
      gender,
      age,
      height,
      weight,
      workout_days,
    });

    await UserProfileModel.save({
      user_id,
      gender,
      age,
      height,
      weight,
      workout_days,
      calorie_target,
    });

    res.status(201).json({
      message: 'Profile created successfully',
      data: {
        gender,
        age,
        height,
        weight,
        workout_days,
        calorie_target,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const profile = await UserProfileModel.getByUserId(user_id);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const { gender, age, height, weight, workout_days, calorie_target } = req.body;

    await UserProfileModel.update(user_id, {
      gender,
      age,
      height,
      weight,
      workout_days,
      calorie_target,
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};