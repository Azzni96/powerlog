import pool from "../database/db";

export type Food = {
    id?: number;
    user_id: string;
    meal_per_day: string;
    meal_time: string;
    meal_type?: string;
    details?: string;
    created_at?: string;
    updated_at?: string;
};

export const createFood = async (food: Food): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query(
        "INSERT INTO food (user_id, meal_per_day, meal_time, meal_type, details) VALUES (?, ?, ?, ?, ?)",
        [food.user_id, food.meal_per_day, food.meal_time, food.meal_type || null, food.details || null]
    );
    conn.release();
    return result;
};

export const getFoodByUser = async (userId: string): Promise<Food[]> => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM food WHERE user_id = ?", [userId]);
    conn.release();
    return result;
};

export const deleteFoodById = async (id: number): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM food WHERE id = ?", [id]);
    conn.release();
    return result;
};

export const updateFood = async (food: Food): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query(
        "UPDATE food SET meal_per_day = ?, meal_time = ?, meal_type = ?, details = ? WHERE id = ?",
        [food.meal_per_day, food.meal_time, food.meal_type || null, food.details || null, food.id]
    );
    conn.release();
    return result;
};