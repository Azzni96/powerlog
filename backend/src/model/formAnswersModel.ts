
import pool from "../database/db";

export type FormAnswer = {
  Id?: number;
  user_id: number;
  form_question_id: number;
  Answer: string;
};

export const createFormAnswer = async (answer: FormAnswer) => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    `INSERT INTO FormAnswers (user_id, form_question_id, Answer)
     VALUES (?, ?, ?)`,
    [answer.user_id, answer.form_question_id, answer.Answer]
  );
  conn.release();
  return result;
};

export const getAnswersByUser = async (user_id: number): Promise<FormAnswer[]> => {
  const conn = await pool.getConnection();
  const result = await conn.query(
    `SELECT * FROM FormAnswers WHERE user_id = ?`,
    [user_id]
  );
  conn.release();
  return result;
};
