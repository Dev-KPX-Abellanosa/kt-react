import { io, Socket } from 'socket.io-client';
import type { WebSocketContactEvent } from '../types/contact.types';
import { api, getServerURL } from '../libs/utils/axios';
import { hasWebSocketToken } from '../libs/utils/cookies';

export class WebSocketService {
    private socket: Socket | null = null;
    private isConnecting: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 3;
    private eventCallback: ((event: WebSocketContactEvent) => void) | null = null;
    async connect() {
        if (this.socket?.connected || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            // Check if we already have a valid WebSocket token
            if (!hasWebSocketToken()) {
                // Get a fresh WebSocket token
                await this.refreshWebSocketToken();
            }
            
            this.socket = io(getServerURL(), {
                withCredentials: true, // Important for sending cookies
                transports: ['websocket', 'polling'],
                path: '/socket.io/' // Explicitly set the Socket.IO path
            });

            this.setupEventHandlers();
            this.reconnectAttempts = 0; // Reset on successful connection
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.handleConnectionError();
        } finally {
            this.isConnecting = false;
        }
    }

    private async refreshWebSocketToken(): Promise<void> {
        try {
            await api.post('/auth/ws-token');
        } catch (error) {
            console.error('Failed to refresh WebSocket token:', error);
            throw new Error('Failed to get WebSocket token');
        }
    }

    private setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
            
            if (reason === 'io server disconnect') {
                // Server disconnected us, try to reconnect
                this.handleReconnect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            
            // If it's an authentication error, try to refresh the token
            if (error.message.includes('WebSocket token') || error.message.includes('Authentication')) {
                this.handleTokenRefresh();
            } else {
                this.handleConnectionError();
            }
        });


        this.socket.on('contact_update', (event) => {
            console.log(event)
            if (this.eventCallback) {
                this.eventCallback(event);
            }
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    private async handleTokenRefresh() {
        try {
            await this.refreshWebSocketToken();
            // Try to reconnect with the new token
            this.socket?.connect();
        } catch (error) {
            console.error('Failed to refresh token:', error);
            this.handleConnectionError();
        }
    }

    private handleConnectionError() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, 1000 * this.reconnectAttempts); // Exponential backoff
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    private async handleReconnect() {
        try {
            await this.refreshWebSocketToken();
            this.connect();
        } catch (error) {
            console.error('Failed to reconnect:', error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnecting = false;
        this.reconnectAttempts = 0;
    }

    onContactUpdate(callback: (event: WebSocketContactEvent) => void) {
        this.eventCallback = callback;
    }

    offContactUpdate() {
        this.eventCallback = null;
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Method to manually refresh the WebSocket token
    async refreshToken(): Promise<void> {
        await this.refreshWebSocketToken();
    }
}

// Create a singleton instance
export const wsService = new WebSocketService(); 