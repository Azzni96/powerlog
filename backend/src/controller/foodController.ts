import { Request, Response } from "express";
import { createFood, getFoodByUser, deleteFoodById, updateFood} from "../model/foodmodel";


export const createFoodController = async (req: Request, res: Response) => {
    try {
        const { user_id, meal_per_day, meal_time, meal_type, details } = req.body;
        const food = { user_id, meal_per_day, meal_time, meal_type, details };
        await createFood(food);
        res.status(201).json({ message: "Food created successfully" });
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ error: "Failed to create food" });
    }
}

export const getFoodByUserController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Assuming user ID is stored in the request after authentication
        const foodEntries = await getFoodByUser(userId);
        res.status(200).json(foodEntries);
    } catch (error) {
        console.error("Error fetching food entries:", error);
        res.status(500).json({ error: "Failed to fetch food entries" });
    }
}

export const deleteFoodEntryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteFoodById(Number(id));
        res.status(200).json({ message: "Food entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting food entry:", error);
        res.status(500).json({ error: "Failed to delete food entry" });
    }
}
export const updateFoodEntryController = async (req: Request, res: Response) => {
    try {
        const { id, meal_per_day, meal_time, meal_type, details } = req.body;
        const user_id = (req as any).user.id; // Assuming user ID is stored in the request after authentication
        const foods = { id, user_id, meal_per_day, meal_time, meal_type, details };
        await updateFood(foods);
        res.status(200).json({ message: "Food entry updated successfully" });
    } catch (error) {
        console.error("Error updating food entry:", error);
        res.status(500).json({ error: "Failed to update food entry" });
    }
}