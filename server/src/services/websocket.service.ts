import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { WebSocketContactEvent } from '../types/contact.types';

interface WebSocketTokenPayload {
    userId: string;
    email: string;
    type: string;
    sessionId: string;
}

export class WebSocketService {
    private io: SocketIOServer;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId
    private sessionSockets: Map<string, string> = new Map(); // sessionId -> socketId

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: true, // Allow all origins in development
                methods: ["GET", "POST"],
                credentials: true // Important for cookies
            },
            allowEIO3: true, // Allow Engine.IO v3 clients
            transports: ['websocket', 'polling']
        });

        this.setupMiddleware();
        this.setupEventHandlers();
        
        console.log('WebSocket service initialized');
    }

    private setupMiddleware() {
        this.io.use((socket, next) => {
            // Get WebSocket token from cookies
            const cookies = socket.handshake.headers.cookie;
            let wsToken: string | null = null;

            if (cookies) {
                const tokenMatch = cookies.match(/ws_token=([^;]+)/);
                if (tokenMatch) {
                    wsToken = decodeURIComponent(tokenMatch[1]);
                }
            }

            if (!wsToken) {
                console.log('WebSocket connection rejected: No token found');
                return next(new Error('WebSocket token not found'));
            }

            try {
                const wsTokenSecret = process.env.WS_TOKEN_SECRET || process.env.JWT_SECRET || 'ws-secret-key';
                const decoded = jwt.verify(wsToken, wsTokenSecret) as WebSocketTokenPayload;
                
                // Validate token type
                if (decoded.type !== 'websocket') {
                    console.log('WebSocket connection rejected: Invalid token type');
                    return next(new Error('Invalid token type'));
                }

                // Check if session is already in use - allow reconnection from same session
                if (this.sessionSockets.has(decoded.sessionId)) {
                    console.log('Session already exists, removing old connection for session:', decoded.sessionId);
                    this.sessionSockets.delete(decoded.sessionId);
                }

                socket.data.userId = decoded.userId;
                socket.data.sessionId = decoded.sessionId;
                socket.data.email = decoded.email;
                console.log('WebSocket authenticated for user:', decoded.userId);
                next();
            } catch (error) {
                console.error('WebSocket token verification error:', error);
                next(new Error('Invalid WebSocket token'));
            }
        });
    }

    private setupEventHandlers() {
        this.io.on('connection', (socket) => {
            const userId = socket.data.userId;
            const sessionId = socket.data.sessionId;
            
            this.userSockets.set(userId, socket.id);
            this.sessionSockets.set(sessionId, socket.id);

            console.log(`User ${userId} connected with session ${sessionId}`);

            socket.on('disconnect', () => {
                this.userSockets.delete(userId);
                this.sessionSockets.delete(sessionId);
                console.log(`User ${userId} disconnected (session: ${sessionId})`);
            });

            // Join user to their personal room for targeted updates
            socket.join(`user_${userId}`);
        });
    }

    public emitContactEvent(event: WebSocketContactEvent) {
        try {
            // Emit to the specific user's room
            const roomName = `user_${event.userId}`;
            console.log('WebSocket: Emitting event to room:', roomName, 'Event type:', event.type);
            
            // Check if room exists and has connected sockets
            const room = this.io.sockets.adapter.rooms.get(roomName);
            if (room && room.size > 0) {
                this.io.to(roomName).emit('contact_update', event);
                console.log('Event emitted successfully to', room.size, 'socket(s)');
            } else {
                console.log('No connected sockets in room:', roomName);
            }
        } catch (error) {
            console.error('Error emitting WebSocket event:', error);
        }
    }

    public emitContactCreated(contact: any, userId: string) {
        console.log('WebSocket: Emitting contact_created to user room:', `user_${userId}`);
        this.emitContactEvent({
            type: 'contact_created',
            contact,
            userId
        });
    }

    public emitContactUpdated(contact: any, userId: string) {
        console.log('WebSocket: Emitting contact_updated to user room:', `user_${userId}`);
        this.emitContactEvent({
            type: 'contact_updated',
            contact,
            userId
        });
    }

    public emitContactDeleted(contact: any, userId: string) {
        console.log('WebSocket: Emitting contact_deleted to user room:', `user_${userId}`);
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