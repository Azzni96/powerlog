import db from '../database/db';

export const FoodModel = {
  getByUserId: async (user_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      'SELECT * FROM Food WHERE user_id = ? ORDER BY meal_time',
      [user_id]
    );
    conn.release();
    return result;
  },

  addMeal: async (data: {
    user_id: number;
    meals_per_day: number;
    meal_time: string; // 'HH:mm:ss'
    meal_type: string;
    details: string;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `INSERT INTO Food (user_id, meals_per_day, meal_time, meal_type, details)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.meals_per_day,
        data.meal_time,
        data.meal_type,
        data.details,
      ]
    );
    conn.release();
    return result;
  },
  deleteMeal: async (meal_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query('DELETE FROM Food WHERE id = ?', [meal_id]);
    conn.release();
    return result;
  }, 
  updateMeal: async (id: number, data: {
    meals_per_day: number;
    meal_time: string; // 'HH:mm:ss'
    meal_type: string;
    details: string;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `UPDATE Food SET meals_per_day = ?, meal_time = ?, meal_type = ?, details = ? WHERE id = ?`,
      [
        data.meals_per_day,
        data.meal_time,
        data.meal_type,
        data.details,
        id,
      ]
    );
    conn.release();
    return result;
  },
};
