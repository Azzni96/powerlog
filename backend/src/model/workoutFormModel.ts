import db from '../database/db';

export const WorkoutFormModel = {
  getAll: async () => {
    const conn = await db.getConnection();
    const result = await conn.query('SELECT * FROM WorkoutForms');
    conn.release();
    return result;
  },

  create: async (data: {
    workout_program: string;
    times_performed: number;
    weight_kg: number;
    sets: '3X' | '2X';
    description?: string;
    duration_minutes?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    video?: string;
    photo?: string;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `INSERT INTO WorkoutForms 
      (workout_program, times_performed, weight_kg, sets, description, duration_minutes, difficulty, video, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.workout_program,
        data.times_performed,
        data.weight_kg,
        data.sets,
        data.description,
        data.duration_minutes,
        data.difficulty,
        data.video,
        data.photo,
      ]
    );
    conn.release();
    return result;
  },
};
