import express from 'express';
import { getUserMeals, addMeal, updateMeal, deleteMeal } from '../controller/foodController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/', authenticate, getUserMeals);
router.post('/', authenticate, addMeal);
router.put('/:id', authenticate, updateMeal);
router.delete('/:id', authenticate, deleteMeal);

export default router;
