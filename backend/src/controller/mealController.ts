import { Request, Response } from "express";
import { getMealsByUser, addMeal, deleteMeal, Meal } from "../model/mealModel";

// Hae käyttäjän ateriat
export const getUserMeals = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const meals = await getMealsByUser(userId);
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
};

// Lisää ateria käyttäjälle
export const createMeal = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { name, calories, protein, carbs, fat, mealType, image } = req.body;

        if (!name || !calories || !protein || !carbs || !fat || !mealType) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        const newMeal: Meal = { name, calories, protein, carbs, fat, mealType, image, user_id: userId };
        await addMeal(newMeal);
        res.status(201).json({ message: "Meal added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add meal" });
    }
};

// Poista ateria (vain sen lisännyt käyttäjä voi poistaa sen)
export const removeMeal = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        await deleteMeal(parseInt(id), userId);
        res.status(200).json({ message: "Meal deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete meal" });
    }
};
