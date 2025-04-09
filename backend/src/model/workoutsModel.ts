import pool from "../database/db";

export type Workout = {
  id?: number;
  user_id: number;
  workout_form_id?: number;
  workout_program: string;
  times_performed: number;
  weight_kg: number;
  sets: '3X' | '2X';
  video?: string;
  photo?: string;
  is_done?: 'yes' | 'no';
  completion_time?: string;
  created_at?: string;
  updated_at?: string;
};

export const createWorkout = async (workout: Workout): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
        `INSERT INTO workout (user_id, workout_form_id, workout_program, times_performed, weight_kg, sets, video, photo, is_done, completion_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [workout.user_id, workout.workout_form_id || null, workout.workout_program, workout.times_performed, workout.weight_kg, workout.sets, workout.video || null, workout.photo || null, workout.is_done || 'no', workout.completion_time || null]
    );
    conn.release();
    return; 
}   

export const getWorkoutByUser = async (userId: number): Promise<Workout[]> => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM workout WHERE user_id = ?", [userId]);
    conn.release();
    return result;
};

export const deleteWorkoutById = async (id: number): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM workout WHERE id = ?", [id]);
    conn.release();
    return;
};

export const updateWorkout = async (workout: Workout): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
        "UPDATE workout SET user_id = ?, workout_form_id = ?, workout_program = ?, times_performed = ?, weight_kg = ?, sets = ?, video = ?, photo = ?, is_done = ?, completion_time = ? WHERE id = ?",
        [workout.user_id, workout.workout_form_id || null, workout.workout_program, workout.times_performed, workout.weight_kg, workout.sets, workout.video || null, workout.photo || null, workout.is_done || 'no', workout.completion_time || null, workout.id]
    );
    conn.release();
    return;
};




