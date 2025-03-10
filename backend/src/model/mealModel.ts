import pool from "../database/db";

export type Meal = {
    id?: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
    image?: string;
    user_id: number;
};

// Hae kaikki ateriat tietylle käyttäjälle
export const getMealsByUser = async (userId: number): Promise<Meal[]> => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM meal_plans WHERE user_id = ?", [userId]);
    conn.release();
    return rows as Meal[];
};

// Lisää ateria tietylle käyttäjälle
export const addMeal = async (meal: Meal): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
        "INSERT INTO meal_plans (name, calories, protein, carbs, fat, mealType, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, meal.mealType, meal.image || null, meal.user_id]
    );
    conn.release();
};

// Poista ateria käyttäjältä
export const deleteMeal = async (mealId: number, userId: number): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM meal_plans WHERE id = ? AND user_id = ?", [mealId, userId]);
    conn.release();
};
