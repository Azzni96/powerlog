import pool from '../database/db';

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    user_level: 'admin' | 'owner' | 'customer';
    };

export const createUser = async (user: User): Promise<void> => {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            'INSERT INTO users (name, email, password, confirm_password, user_level) VALUES (?, ?, ?, ?, ?)',
            [user.name, user.email, user.password, user.confirm_password, user.user_level] 
        );
    }
    catch (error) {
        console.error('Error creating user', error);
    }
     finally {
        conn.release();
    }
    } 

