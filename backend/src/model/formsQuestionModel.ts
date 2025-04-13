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
  update: async (
    id: number,
    data: {
      category: string;
      question: string;
      max: number;
      answer: string;
    }
  ) => {
    const conn = await db.getConnection();
    await conn.query(
      `UPDATE FormsQuestions SET category = ?, question = ?, max = ?, answer = ? WHERE id = ?`,
      [data.category, data.question, data.max, data.answer, id]
    );
    conn.release();
  },
  
  delete: async (id: number) => {
    const conn = await db.getConnection();
    await conn.query(`DELETE FROM FormsQuestions WHERE id = ?`, [id]);
    conn.release();
  },
  
};