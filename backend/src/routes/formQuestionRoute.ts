import express from 'express';
import { authenticate, isCustomer, isAdmin } from '../middleware/authenticate';

import {
    createFormQuestionController,
    getFormQuestionsController,
    updateFormQuestionController,
    deleteFormQuestionController
} from '../controller/formQuestionController';


const router = express.Router();

router.use(authenticate); // Apply authentication middleware to all routes
router.post('/create', isAdmin, createFormQuestionController); 
router.get('/', isCustomer, getFormQuestionsController);
router.put('/update', isAdmin, updateFormQuestionController);
router.delete('/delete/:id', isAdmin, deleteFormQuestionController); // Use isAdmin middleware for deletion

export default router;
