import express from 'express';
import {updateUserProfile, createUserProfile, getUserProfile } from '../controller/userProfileController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.post('/', authenticate, createUserProfile);
router.get('/', authenticate, getUserProfile);
router.put('/', authenticate, updateUserProfile);
export default router;
