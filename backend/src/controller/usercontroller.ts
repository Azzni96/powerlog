import { Request, Response } from 'express';
import { createUser } from '../model/usermodel';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, confirm_password, user_level } = req.body;
        if (!name || !email || !password || !confirm_password ) {
            res.status(400).send('Please provide all required fields');
            return;
        }
        const validUserLevels = ['admin', 'owner', 'customer'];
        const level = validUserLevels.includes(user_level) ? user_level : 'customer';

        const hashedPassword = await bcryptjs.hash(password, 10);
        await createUser({ id: Date.now(), name, email, password: hashedPassword, confirm_password: hashedPassword, user_level: level });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user', error);
    }
};
