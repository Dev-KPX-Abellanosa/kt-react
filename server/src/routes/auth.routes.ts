import { Router } from 'express';
import { login, register, logout, me, generateWebSocketToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, me);
router.post('/ws-token', authenticateToken, generateWebSocketToken);

export default router; 