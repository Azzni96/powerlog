import express from 'express';
import { authenticate, isCustomer, isAdmin } from '../middleware/authenticate';
import { createFoodController, getFoodByUserController, deleteFoodEntryController, updateFoodEntryController } from '../controller/foodController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes for food entries
router.post('/create', isCustomer, createFoodController); // Use isCustomer middleware for creation
router.get('/', isCustomer, isAdmin, getFoodByUserController); // Use isCustomer middleware for fetching entries
router.delete('/delete/:id', isAdmin, deleteFoodEntryController); // Use isAdmin middleware for deletion
router.put('/update', isCustomer, updateFoodEntryController); // Use isCustomer middleware for updating entries

export default router;