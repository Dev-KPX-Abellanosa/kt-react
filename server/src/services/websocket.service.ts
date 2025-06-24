import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { WebSocketContactEvent } from '../types/contact.types';

export class WebSocketService {
    private io: SocketIOServer;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    private setupMiddleware() {
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            
            if (!token) {
                return next(new Error('Authentication error'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                socket.data.userId = decoded.id;
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            const userId = socket.data.userId;
            this.userSockets.set(userId, socket.id);

            console.log(`User ${userId} connected with socket ${socket.id}`);

            socket.on('disconnect', () => {
                this.userSockets.delete(userId);
                console.log(`User ${userId} disconnected`);
            });

            // Join user to their personal room for targeted updates
            socket.join(`user_${userId}`);
        });
    }

    public emitContactEvent(event: WebSocketContactEvent) {
        // Emit to the specific user's room
        this.io.to(`user_${event.userId}`).emit('contact_update', event);
    }

    public emitContactCreated(contact: any, userId: string) {
        this.emitContactEvent({
            type: 'contact_created',
            contact,
            userId
        });
    }

    public emitContactUpdated(contact: any, userId: string) {
        this.emitContactEvent({
            type: 'contact_updated',
            contact,
            userId
        });
    }

    public emitContactDeleted(contact: any, userId: string) {
        this.emitContactEvent({
            type: 'contact_deleted',
            contact,
            userId
        });
    }

    public getIO() {
        return this.io;
    }
} 