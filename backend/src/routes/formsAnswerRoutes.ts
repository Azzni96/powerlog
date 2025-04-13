import express from 'express';
import {
  getAnswersByQuestion,
  createAnswer,
} from '../controller/formsAnswerController';

const router = express.Router();

router.get('/:questionId', getAnswersByQuestion);
router.post('/', createAnswer);

export default router;
