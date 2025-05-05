import { Request, Response } from "express";
import {
  getFoodEntries,
  createFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
} from "../model/foodModel";
import axios from "axios";

/**
 * @api {get} /api/food Get User Food Logs
 * @apiName GetFoodLogs
 * @apiGroup Food
 * @apiDescription Retrieves all food logs for the authenticated user.
 *
 * @apiSuccess {Object[]} entries List of food entries
 * @apiSuccess {Number} entries.id Entry ID
 * @apiSuccess {Number} entries.user_id User ID
 * @apiSuccess {Number} entries.meals_per_day Number of meals per day
 * @apiSuccess {String} entries.meal_time Time of meal
 * @apiSuccess {String} entries.meal_type Type of meal
 * @apiSuccess {String} entries.details Additional meal details
 * @apiSuccess {Date} entries.created_at Creation timestamp
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {post} /api/food Add Food Log
 * @apiName AddFoodLog
 * @apiGroup Food
 * @apiDescription Creates a new food log entry for the authenticated user.
 *
 * @apiBody {Number} meals_per_day Number of meals consumed per day
 * @apiBody {String} meal_time Time the meal was consumed
 * @apiBody {String} meal_type Type of meal
 * @apiBody {String} details Additional details about the meal
 *
 * @apiSuccess {Object} result Result message
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {put} /api/food/:id Update Food Log
 * @apiName UpdateFoodLog
 * @apiGroup Food
 * @apiDescription Updates an existing food log entry.
 *
 * @apiParam {Number} id Food entry ID
 *
 * @apiBody {Number} meals_per_day Updated number of meals per day
 * @apiBody {String} meal_time Updated meal time
 * @apiBody {String} meal_type Updated meal type
 * @apiBody {String} details Updated meal details
 *
 * @apiSuccess {Object} result Result message
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {delete} /api/food/:id Delete Food Log
 * @apiName DeleteFoodLog
 * @apiGroup Food
 * @apiDescription Deletes a food log entry.
 *
 * @apiParam {Number} id Food entry ID to delete
 *
 * @apiSuccess {Object} result Result message
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
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

/**
 * @api {post} /api/food/search Search Food in Nutritionix
 * @apiName SearchNutritionixFood
 * @apiGroup Food
 * @apiDescription Searches for food items in the Nutritionix database.
 *
 * @apiBody {String} query Search query string
 *
 * @apiSuccess {Object} searchResults Nutritionix search results
 * @apiSuccess {Object[]} searchResults.common Common food items
 * @apiSuccess {Object[]} searchResults.branded Branded food items
 *
 * @apiError {Object} error Error message
 */
export const searchNutritionixFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    console.log("Searching for:", query);

    const response = await axios.post(
      "https://trackapi.nutritionix.com/v2/search/instant",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_API_KEY,
        },
      }
    );

    console.log("API response status:", response.status);
    console.log("Has data:", !!response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error searching food:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @api {get} /api/food/nutrition/:foodId Get Nutrition Information
 * @apiName GetNutritionInfo
 * @apiGroup Food
 * @apiDescription Gets detailed nutrition information for a specific food item.
 *
 * @apiParam {String} foodId Food name or identifier
 *
 * @apiSuccess {Object} nutritionData Detailed nutrition information
 * @apiSuccess {Object[]} nutritionData.foods Array of food items with nutrition details
 *
 * @apiError {Object} error Error message
 */
export const getNutritionInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const foodName = req.params.foodId;

    console.log("Getting nutrition for:", foodName);

    if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_API_KEY) {
      console.error("Missing Nutritionix credentials");
      res.status(500).json({ error: "API configuration error" });
      return;
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
