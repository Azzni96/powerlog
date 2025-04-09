// workoutFormModel.ts
import pool from "../database/db";

export type WorkoutForm = {
  Id?: number;
  workout_program: string;
  times_performed: number;
  weight_kg: number;
  sets: '3X' | '2X';
  description?: string;
  duration_minutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  video?: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
};

export const createWorkoutForm = async (form: WorkoutForm) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    `INSERT INTO WorkoutForms (workout_program, times_performed, weight_kg, sets, description, duration_minutes, difficulty, video, photo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      form.workout_program,
      form.times_performed,
      form.weight_kg,
      form.sets,
      form.description || null,
      form.duration_minutes || null,
      form.difficulty || null,
      form.video || null,
      form.photo || null
    ]
  );
  conn.release();
  return result;
};

export const getAllWorkoutForms = async (): Promise<WorkoutForm[]> => {
  const conn = await pool.getConnection();
  const result = await conn.query("SELECT * FROM WorkoutForms");
  conn.release();
  return result;
};

export const updateWorkoutForm = async (form: WorkoutForm) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    `UPDATE WorkoutForms SET workout_program = ?, times_performed = ?, weight_kg = ?, sets = ?, description = ?, duration_minutes = ?, difficulty = ?, video = ?, photo = ? WHERE Id = ?`,
    [
      form.workout_program,
      form.times_performed,
      form.weight_kg,
      form.sets,
      form.description || null,
      form.duration_minutes || null,
      form.difficulty || null,
      form.video || null,
      form.photo || null,
      form.Id
    ]
  );
  conn.release();
  return result;
};

export const deleteWorkoutForm = async (id: number) => {
  const conn = await pool.getConnection();
  const result = await conn.query("DELETE FROM WorkoutForms WHERE Id = ?", [id]);
  conn.release();
  return result;
};
