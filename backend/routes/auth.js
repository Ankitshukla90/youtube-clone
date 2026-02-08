import express from 'express';
import { login, updateProfile, getUserById } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', login);
router.put('/profile', updateProfile);
router.get('/find/:id', getUserById); // New Route

export default router;