import { Request, Response } from 'express';
import { WorkoutFormModel } from '../model/workoutFormModel';

export const getWorkoutForms = async (req: Request, res: Response) => {
  try {
    const forms = await WorkoutFormModel.getAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout forms' });
  }
};

export const createWorkoutForm = async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    await WorkoutFormModel.create(formData);
    res.status(201).json({ message: 'Workout form created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout form' });
  }
};
export const updateWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    await WorkoutFormModel.update(id, data);

    res.status(200).json({ message: 'Workout form updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout form' });
  }
};

export const deleteWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await WorkoutFormModel.delete(id);
    res.status(200).json({ message: 'Workout form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout form' });
  }
};

