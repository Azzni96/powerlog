import express from 'express';
import {
  getAnswersByQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from '../controller/formsAnswerController';

const router = express.Router();

router.get('/:questionId', getAnswersByQuestion);
router.post('/', createAnswer);
router.put('/:id', updateAnswer);     // ✅ Update
router.delete('/:id', deleteAnswer);  // ✅ Delete

export default router;
