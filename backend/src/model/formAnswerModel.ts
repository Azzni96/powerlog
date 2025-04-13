import db from '../database/db';

export const FormAnswerModel = {
  getByUserId: async (user_id: number) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      `SELECT fa.id, fq.question, fa.Answer
       FROM FormAnswers fa
       JOIN FormsQuestions fq ON fq.id = fa.form_question_id
       WHERE fa.user_id = ?`,
      [user_id]
    );
    conn.release();
    return result;
  },

  create: async (data: {
    user_id: number;
    form_question_id: number;
    Answer: string;
  }) => {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO FormAnswers (user_id, form_question_id, Answer) VALUES (?, ?, ?)',
      [data.user_id, data.form_question_id, data.Answer]
    );
    conn.release();
    return result;
  },
};
