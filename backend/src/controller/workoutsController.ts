import { Request, Response } from "express";

import { createWorkout, deleteWorkoutById, updateWorkout, getWorkoutByUser, Workout } from "../model/workoutsModel";

export const createWorkoutController = async (req: Request, res: Response) => {
    try {
        const workout : Workout= req.body;
        await createWorkout(workout);
        res.status(201).json({ message: "Workout created successfully" });
    } catch (error) {
        console.error("Error creating workout:", error);
        res.status(500).json({ error: "Failed to create workout" });
    }
};

export const getWorkoutByUserController = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const workouts = await getWorkoutByUser(userId);
        res.status(200).json(workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        res.status(500).json({ error: "Failed to fetch workouts" });
    }
}

export const deleteWorkoutController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteWorkoutById(Number(id));
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        console.error("Error deleting workout:", error);
        res.status(500).json({ error: "Failed to delete workout" });
    }
};

export const updateWorkoutController = async (req: Request, res: Response) => {
    try {
        const workout: Workout = req.body;
        await updateWorkout(workout);
        res.status(200).json({ message: "Workout updated successfully" });
    } catch (error) {
        console.error("Error updating workout:", error);
        res.status(500).json({ error: "Failed to update workout" });
    }
};

