import express from 'express';
import {
  getUserAnswers,
  createFormAnswer,
} from '../controller/formAnswerController';

import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/', authenticate, getUserAnswers);
router.post('/', authenticate, createFormAnswer);

export default router;
