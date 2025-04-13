import express from 'express';
import {
  getWorkoutForms,
  createWorkoutForm,
  updateWorkoutForm,
  deleteWorkoutForm,
} from '../controller/workoutFormController';

const router = express.Router();

router.get('/', getWorkoutForms);
router.post('/', createWorkoutForm);
router.put('/:id', updateWorkoutForm);     // ✅ تعديل تمرين
router.delete('/:id', deleteWorkoutForm);  // ✅ حذف تمرين

export default router;
