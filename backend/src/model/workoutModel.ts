import db from '../database/db';

export const WorkoutModel = {
  getByUserId: async (user_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `SELECT w.*, f.video, f.photo 
       FROM Workouts w 
       JOIN WorkoutForms f ON w.workout_form_id = f.Id 
       WHERE w.user_id = ?`,
      [user_id]
    );
    conn.release();
    return result;
  },

  assignWorkout: async (data: {
    user_id: number;
    workout_form_id: number;
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
      `INSERT INTO Workouts 
        (user_id, workout_form_id, workout_program, times_performed, weight_kg, sets, description, duration_minutes, difficulty, video, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user_id,
        data.workout_form_id,
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
  updateAsDone: async (workout_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `UPDATE Workouts 
       SET is_done = 'yes', completion_time = CURRENT_TIMESTAMP 
       WHERE Id = ?`,
      [workout_id]
    );
    conn.release();
    return result;
  },  
  updateAsNotDone: async (workout_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `UPDATE Workouts 
       SET is_done = 'no', completion_time = NULL 
       WHERE Id = ?`,
      [workout_id]
    );
    conn.release();
    return result;
  },  
};
