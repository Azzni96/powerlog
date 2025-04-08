import pool from "../database/db";

export type BmiModel = {
  id?: number;
  user_id: number;
  weight: number;
  height: number;
  bmi_value?: number;
  created_at?: string;
};

export const createBmiEntry = async (bmiEntry: BmiModel): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query(
        `INSERT INTO bmi (user_id, weight, height, bmi_value) VALUES (?, ?, ?, ?)`,
        [bmiEntry.user_id, bmiEntry.weight, bmiEntry.height, bmiEntry.bmi_value]
    );
    conn.release();
    return result;
    };

export const getBmiEntriesByUser = async (userId: number): Promise<BmiModel[]> => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM bmi WHERE user_id = ?", [userId]);
    conn.release();
    return result;
};

export const deleteBmiEntryById = async (id: number): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM bmi WHERE id = ?", [id]);
    conn.release();
    return result;
};

