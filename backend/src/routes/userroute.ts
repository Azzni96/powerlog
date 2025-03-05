import express from 'express';
import { signup } from '../controller/usercontroller';



const router = express.Router();

router.post('/signup', async (req, res) => { 
    await signup(req, res);
});

export default router;