import { Request, Response } from "express";
import {
  createWorkoutForm,
  getAllWorkoutForms,
  updateWorkoutForm,
  deleteWorkoutForm,
  WorkoutForm
} from "../model/workoutFormModel";

export const createWorkoutFormController = async (req: Request, res: Response) => {
  try {
    const form: WorkoutForm = req.body;
    await createWorkoutForm(form);
    res.status(201).json({ message: "Workout form created successfully" });
  } catch (error) {
    console.error("Create workout form error:", error);
    res.status(500).json({ error: "Failed to create workout form" });
  }
};

export const getWorkoutFormsController = async (_req: Request, res: Response) => {
  try {
    const forms = await getAllWorkoutForms();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Get workout forms error:", error);
    res.status(500).json({ error: "Failed to fetch workout forms" });
  }
};

export const updateWorkoutFormController = async (req: Request, res: Response) => {
  try {
    const form: WorkoutForm = req.body;
    await updateWorkoutForm(form);
    res.status(200).json({ message: "Workout form updated successfully" });
  } catch (error) {
    console.error("Update workout form error:", error);
    res.status(500).json({ error: "Failed to update workout form" });
  }
};

export const deleteWorkoutFormController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteWorkoutForm(id);
    res.status(200).json({ message: "Workout form deleted successfully" });
  } catch (error) {
    console.error("Delete workout form error:", error);
    res.status(500).json({ error: "Failed to delete workout form" });
  }
};
