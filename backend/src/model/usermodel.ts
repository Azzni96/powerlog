import pool from "../database/db";

export type User = {
    id?: number;
    name: string;
    email: string;
    password: string;
    user_level: 'admin' | 'restaurant_owner' | 'customer';
};  

export const getAllUsers = async (): Promise<User[]> => {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users");
    conn.release();
    return rows;
}

export const createUser = async (user: User): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO users (name, email, password, user_level) VALUES (?, ?, ?, ?)",
      [user.name, user.email, user.password, user.user_level]
    );
    conn.release();
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    conn.release();
    return rows[0] || null;
};

export const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
    const conn = await pool.getConnection();
    await conn.query("UPDATE users SET password = ? WHERE email = ?", [newPassword, email]);
    conn.release();
};

export const getUserById = async (id: number): Promise<User | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    conn.release();
    return rows[0] || null;
};

export const getUserByName = async (name: string): Promise<User | null> => {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM users WHERE name = ?", [name]);
    conn.release();
    return rows[0] || null;
};
