import db from '../database/db';

export const FormsAnswerModel = {
  getByQuestionId: async (question_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      'SELECT * FROM FormsAnswers WHERE question_id = ?',
      [question_id]
    );
    conn.release();
    return result;
  },

  create: async (data: { question_id: number; answer_text: string }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO FormsAnswers (question_id, answer_text) VALUES (?, ?)',
      [data.question_id, data.answer_text]
    );
    conn.release();
    return result;
  },
};
