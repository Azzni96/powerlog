import e, {Request, Response} from 'express';
import { createBmiEntry, getBmiEntriesByUser, deleteBmiEntryById } from '../model/bmiModel';



export const createBmiEntryController = async (req: Request, res: Response) => {
    try {
        const { weight, height } = req.body;
        const userId = (req as any).user.id; // Assuming user ID is stored in the request after authentication

        const bmiValue = weight / ((height / 100) * (height / 100)); // Calculate BMI value
        const newBmiEntry = await createBmiEntry({ user_id: userId, weight, height, bmi_value: bmiValue });
        res.status(201).json(newBmiEntry);
    } catch (error) {
        res.status(500).json({ error: "Error creating BMI entry" });
    }
}
export const getBmiEntriesController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // Assuming user ID is stored in the request after authentication
        const bmiEntries = await getBmiEntriesByUser(userId);
        res.status(200).json(bmiEntries);
    } catch (error) {
        res.status(500).json({ error: "Error fetching BMI entries" });
    }
}
export const deleteBmiEntryController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteBmiEntryById(Number(id));
        res.status(200).json({ message: "BMI entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting BMI entry" });
    }
}
