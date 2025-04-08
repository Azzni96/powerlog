import pool from "../database/db";

export type FormQuestion = {
    Id?: number;
    Question: string;
    Answer: string;
    created_at?: string;
};

export const createFormQuestion = async (formQuestion: FormQuestion): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query(
        "INSERT INTO formquestions (Question, Answer) VALUES (?, ?)",
        [formQuestion.Question, formQuestion.Answer]
    );
    conn.release();
    return result;
};

export const getFormQuestions = async (): Promise<FormQuestion[]> => {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM formquestions");
    conn.release();
    return result;
};

export const deleteFormQuestionById = async (id: number): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM formquestions WHERE Id = ?", [id]);
    conn.release();
    return result;
};

export const updateFormQuestion = async (formQuestion: FormQuestion): Promise<void> => {
    const conn = await pool.getConnection();
    const result = await conn.query(
        "UPDATE formquestions SET Question = ?, Answer = ? WHERE Id = ?",
        [formQuestion.Question, formQuestion.Answer, formQuestion.Id]
    );
    conn.release();
    return result;
};
