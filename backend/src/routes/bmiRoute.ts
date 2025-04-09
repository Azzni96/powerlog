import express from 'express';
import { authenticate, isCustomer, isAdmin } from '../utils/authenticate';

import { createBmiEntryController, deleteBmiEntryController, getBmiEntriesController } from '../controller/bmiController';

const router = express.Router();

router.use(authenticate); // Apply authentication middleware to all routes

router.post('/create', isCustomer, createBmiEntryController); // Use isCustomer middleware for creation
router.get('/', isCustomer, getBmiEntriesController); // Use isCustomer middleware for fetching entries
router.delete('/delete/:id', isAdmin, deleteBmiEntryController); // Use isAdmin middleware for deletion

export default router;