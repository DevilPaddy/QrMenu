import express from 'express';
import { signup, login, googleLogin } from '../controllers/auth.controller.js';
import { validateSignup, validateLogin, validateGoogleLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/google', validateGoogleLogin, googleLogin);

export default router;
