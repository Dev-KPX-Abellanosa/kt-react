import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth.types';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req: Request<{}, {}, RegisterCredentials>, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
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
        const token = jwt.sign(
            { userId, email },
            process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const response: AuthResponse = {
            token,
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

export const login = async (req: Request<{}, {}, LoginCredentials>, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = Array.isArray(users) ? users[0] as User : null;

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const response: AuthResponse = {
            token,
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