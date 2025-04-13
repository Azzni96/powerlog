import { Request, Response } from 'express';
import { WorkoutModel } from '../model/workoutModel';

export const getUserWorkout = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    if (!user_id)  res.status(401).json({ error: 'Unauthorized' });

    const workouts = await WorkoutModel.getByUserId(user_id);
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user workouts' });
  }
};
export const markWorkoutAsDone = async (req: Request, res: Response) => {
    try {
      const workoutId = Number(req.params.id);
  
      if (isNaN(workoutId)) {
         res.status(400).json({ error: 'Invalid workout ID' });
      }
  
      await WorkoutModel.updateAsDone(workoutId);
      res.status(200).json({ message: 'Workout marked as completed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update workout status' });
    }
  };
  export const markWorkoutAsNotDone = async (req: Request, res: Response) => {
    try {
      const workoutId = Number(req.params.id);
  
      if (isNaN(workoutId)) {
         res.status(400).json({ error: 'Invalid workout ID' });
      }
      await WorkoutModel.updateAsNotDone(workoutId);
      res.status(200).json({ message: 'Workout marked as not done' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update workout status' });
    }
  };
  