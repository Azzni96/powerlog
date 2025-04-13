import express from 'express';
import { getUserBmi, createBmi, updateBmi, deleteBmi } from '../controller/bmiController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/', authenticate, getUserBmi);
router.post('/', authenticate, createBmi);
router.put('/:id', authenticate, updateBmi);   // ✅ Update
router.delete('/:id', authenticate, deleteBmi); // ✅ Delete

export default router;