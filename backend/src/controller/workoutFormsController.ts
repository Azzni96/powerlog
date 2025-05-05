import { Request, Response } from "express";
import {
  getAllWorkoutForms,
  createWorkoutForm,
  updateWorkoutForm,
  deleteWorkoutForm,
} from "../model/workoutFormsModel";

// GET all workout forms
export const fetchWorkoutForms = async (req: Request, res: Response) => {
  try {
    const forms = await getAllWorkoutForms();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching workout forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create new workout form
export const addWorkoutForm = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.image?.[0]?.filename || null;
    const video = files?.video?.[0]?.filename || null;

    const workoutData = {
      ...req.body,
      photo: image,
      video: video
    };

    const id = await createWorkoutForm(workoutData);
    res.status(201).json({ message: "Workout form created", id: String(id) });
  } catch (error) {
    console.error("Error adding workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update existing workout form
export const modifyWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.image?.[0]?.filename || null;
    const video = files?.video?.[0]?.filename || null;

    const workoutData = {
      ...req.body,
      photo: image,
      video: video
    };

    await updateWorkoutForm(id, workoutData);
    res.status(200).json({ message: "Workout form updated" });
  } catch (error) {
    console.error("Error updating workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE workout form
export const removeWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteWorkoutForm(id);
    res.status(200).json({ message: "Workout form deleted" });
  } catch (error) {
    console.error("Error deleting workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};
