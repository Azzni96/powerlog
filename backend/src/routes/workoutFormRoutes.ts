import express from 'express';
import { getWorkoutForms, createWorkoutForm } from '../controller/workoutFormController';

const router = express.Router();

router.get('/', getWorkoutForms);
router.post('/', createWorkoutForm);

export default router;
