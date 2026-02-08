import express from 'express';
import { login, updateProfile } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', login);
router.put('/profile', updateProfile); // NEW ROUTE

export default router;