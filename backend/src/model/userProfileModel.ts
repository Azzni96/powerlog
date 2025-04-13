import db from '../database/db';

export const UserProfileModel = {
  save: async (data: {
    user_id: number;
    gender: string;
    age: number;
    height: number;
    weight: number;
    workout_days: number;
    calorie_target: number;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `INSERT INTO User_Profiles 
       (user_id, gender, age, height, weight, workout_days, calorie_target)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.gender,
        data.age,
        data.height,
        data.weight,
        data.workout_days,
        data.calorie_target,
      ]
    );
    conn.release();
    return result;
  },

  getByUserId: async (user_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `SELECT * FROM User_Profiles WHERE user_id = ?`,
      [user_id]
    );
    conn.release();
    return result[0];
  },
  update: async (user_id: number, data: {
    gender: string;
    age: number;
    height: number;
    weight: number;
    workout_days: number;
    calorie_target: number;
  }) => {
    const conn = await db.getConnection();
    await conn.query(
      `UPDATE User_Profiles SET gender = ?, age = ?, height = ?, weight = ?, workout_days = ?, calorie_target = ?
       WHERE user_id = ?`,
      [data.gender, data.age, data.height, data.weight, data.workout_days, data.calorie_target, user_id]
    );
    conn.release();
  },
  
};
