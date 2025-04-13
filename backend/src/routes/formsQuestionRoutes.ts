import express from 'express';
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controller/formsQuestionController';

const router = express.Router();

router.get('/', getAllQuestions);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);     // ✅ Update
router.delete('/:id', deleteQuestion);  // ✅ Delete

export default router;
