import { io, Socket } from 'socket.io-client';
import type { WebSocketContactEvent } from '../types/contact.types';

export class WebSocketService {
    private socket: Socket | null = null;
    private token: string | null = null;

    connect(token: string) {
        this.token = token;
        
        this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            auth: {
                token: token
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onContactUpdate(callback: (event: WebSocketContactEvent) => void) {
        if (this.socket) {
            this.socket.on('contact_update', callback);
        }
    }

    offContactUpdate(callback: (event: WebSocketContactEvent) => void) {
        if (this.socket) {
            this.socket.off('contact_update', callback);
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

// Create a singleton instance
export const wsService = new WebSocketService(); 