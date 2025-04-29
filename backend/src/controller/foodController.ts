import { Request, Response } from "express";
import {
  getFoodEntries,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
} from "../model/foodModel";
import axios from "axios";

// GET: all food logs
export const fetchFood = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const entries = await getFoodEntries(userId);
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST: create food log
export const addFood = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { meals_per_day, meal_time, meal_type, details } = req.body;

    await createFoodEntry(userId, meals_per_day, meal_time, meal_type, details);
    res.status(201).json({ message: "Meal added" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT: update food
export const editFood = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const foodId = parseInt(req.params.id);
    const { meals_per_day, meal_time, meal_type, details } = req.body;

    await updateFoodEntry(foodId, userId, {
      meals_per_day,
      meal_time,
      meal_type,
      details,
    });

    res.status(200).json({ message: "Meal updated" });
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const removeFood = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const foodId = parseInt(req.params.id);
    await deleteFoodEntry(foodId, userId);
    res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const searchNutritionixFood = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/search/instant",
      { query, detailed: true },
      {
        headers: {
          "Content-Type": "application/json",
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error searching food:", error);
    res.status(500).json({ error: "Failed to search foods" });
  }
};

export const getNutritionInfo = async (req: Request, res: Response) => {
  try {
    const { foodName } = req.body;

    if (!foodName || foodName.trim() === "") {
      return res.status(400).json({ error: "Food name is required" });
    }

    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query: foodName },
      {
        headers: {
          "Content-Type": "application/json",
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error getting nutrition info:", error);
    res.status(500).json({ error: "Failed to get nutrition information" });
  }
};
