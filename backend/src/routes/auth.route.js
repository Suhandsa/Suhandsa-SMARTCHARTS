import express from 'express';
import { login, signup,logout,onboard } from '../controllers/auth.controller.js';
const router = express.Router();
import { protectRoute } from '../middleware/auth.middleware.js';

router.post('/signup',signup);

router.post('/login', login);

router.post('/logout', logout);

//to be prtected
router.post('/onboarding',protectRoute, onboard);

export default router;