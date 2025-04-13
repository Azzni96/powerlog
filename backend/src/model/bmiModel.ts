import db from '../database/db';

export const BmiModel = {
  getByUserId: async (user_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      'SELECT id, weight, height, bmi_value, created_at FROM BMI WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    conn.release();
    return result;
  },

  create: async (data: { user_id: number; weight: number; height: number }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `INSERT INTO BMI (user_id, weight, height)
       VALUES (?, ?, ?)`,
      [data.user_id, data.weight, data.height]
    );
    conn.release();
    return result;
  },
};
