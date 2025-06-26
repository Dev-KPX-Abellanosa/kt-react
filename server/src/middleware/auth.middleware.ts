import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Get token from HTTP-only cookie
    const token = req.cookies?.auth_token;

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production') as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
        return;
    }
}; 