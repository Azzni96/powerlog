import express from 'express';
import { authenticate, isCustomer, isAdmin } from '../utils/authenticate';
import { createWorkoutController, getWorkoutByUserController, deleteWorkoutController, updateWorkoutController } from '../controller/workoutsController';
import e from 'express';

const router = express.Router();
router.use(authenticate); // Apply authentication middleware to all routes

router.post('/create', isCustomer, createWorkoutController); // Use isCustomer middleware for creation  
router.get('/', isCustomer, isAdmin, getWorkoutByUserController); // Use isCustomer middleware for fetching entries
router.delete('/delete/:id', isAdmin, deleteWorkoutController); // Use isAdmin middleware for deletion
router.put('/update', isCustomer, updateWorkoutController); // Use isCustomer middleware for updating entries

export default router;