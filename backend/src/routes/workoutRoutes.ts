import express from 'express';
import { getUserWorkout, markWorkoutAsDone, markWorkoutAsNotDone  } from '../controller/workoutController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/', authenticate, getUserWorkout);
router.put('/:id/complete', authenticate, markWorkoutAsDone);
router.put('/:id/reset', authenticate, markWorkoutAsNotDone);
export default router;
