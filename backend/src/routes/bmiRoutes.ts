import express from 'express';
import { getUserBmi, createBmi } from '../controller/bmiController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/', authenticate, getUserBmi);
router.post('/', authenticate, createBmi);

export default router;
