import express from 'express';
import { createUserProfile, getUserProfile } from '../controller/userProfileController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.post('/', authenticate, createUserProfile);
router.get('/', authenticate, getUserProfile);

export default router;
