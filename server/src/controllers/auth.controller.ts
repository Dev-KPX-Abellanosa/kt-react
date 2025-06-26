import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth.types';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;
        console.log("asds")
        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const userId = uuidv4();
        await pool.execute(
            'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
            [userId, email, hashedPassword, name]
        );

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';
        const token = (jwt.sign as any)(
            { userId, email },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Set secure HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        const response: AuthResponse = {
            token: '', // Don't send token in response body
            user: {
                id: userId,
                email,
                name
            }
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = Array.isArray(users) ? users[0] as User : null;

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';
        const token = (jwt.sign as any)(
            { userId: user.id, email: user.email },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Set secure HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        const response: AuthResponse = {
            token: '', // Don't send token in response body
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear the auth cookie
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        // User data is already available from auth middleware
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 