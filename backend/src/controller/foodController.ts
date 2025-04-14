import { Request, Response } from 'express';
import { FoodModel } from '../model/foodModel';

export const getUserMeals = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const meals = await FoodModel.getByUserId(user_id);
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
};

export const addMeal = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user?.id;
    const { meals_per_day, meal_time, meal_type, details } = req.body;

    if (!meals_per_day || !meal_time || !meal_type || !details) {
       res.status(400).json({ error: 'Missing meal data' });
    }

    await FoodModel.addMeal({
      user_id,
      meals_per_day,
      meal_time,
      meal_type,
      details,
    });

    res.status(201).json({ message: 'Meal added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add meal' });
  }
};
export const updateMeal = async (req: Request, res: Response) => {
    try {
      const mealId = Number(req.params.id);
      const { meals_per_day, meal_time, meal_type, details } = req.body;
  
      await FoodModel.updateMeal(mealId, { meals_per_day, meal_time, meal_type, details });
  
      res.status(200).json({ message: 'Meal updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update meal' });
    }
  };

export const deleteMeal = async (req: Request, res: Response) => {
try {
    const mealId = Number(req.params.id);
    await FoodModel.deleteMeal(mealId);
    res.status(200).json({ message: 'Meal deleted successfully' });
} catch (error) {
    res.status(500).json({ error: 'Failed to delete meal' });
}
};
  