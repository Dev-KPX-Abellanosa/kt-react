// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import { authenticateToken } from './middleware/auth.middleware';
import { Request, Response } from 'express';
import { WebSocketService } from './services/websocket.service';
import { setWebSocketService } from './controllers/contact.controller';

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

// Initialize WebSocket service
const wsService = new WebSocketService(server);
setWebSocketService(wsService);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true // Important for cookies
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// WebSocket test endpoint
app.get('/api/ws-test', (req: Request, res: Response) => {
    res.json({ 
        message: 'WebSocket server is running',
        timestamp: new Date().toISOString()
    });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/', (req, res) => {
    res.send('Hello from Express with TypeScript!');
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`WebSocket server ready for connections`);
});