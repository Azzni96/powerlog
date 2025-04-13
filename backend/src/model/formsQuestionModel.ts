import db from '../database/db';

export const FormQuestionModel = {

  getAll: async () => {
    const conn = await db.getConnection();
    const rows = await conn.query("SELECT * FROM forms_questions");
    conn.release();
    return rows;
  },

  create: async (data: {
    category: string;
    question: string;
    max: number;
    answer: string;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO forms_questions (category, question, max, answer) VALUES (?, ?, ?, ?)",
      [data.category, data.question, data.max, data.answer]
    );
    conn.release();
    return result;
  },
};