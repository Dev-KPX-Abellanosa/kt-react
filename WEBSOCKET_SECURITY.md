# WebSocket Token Security System

This document explains the secure WebSocket token system implemented for real-time communication in the application.

## Overview

The WebSocket token system provides secure, authenticated real-time communication between the client and server using HTTP-only cookies and short-lived tokens.

## Security Features

### 1. Separate WebSocket Tokens
- WebSocket connections use dedicated tokens separate from authentication tokens
- Tokens are short-lived (1 hour) for enhanced security
- Each token includes a unique session ID to prevent session hijacking

### 2. HTTP-Only Cookies
- WebSocket tokens are stored in HTTP-only cookies
- Prevents XSS attacks from accessing tokens via JavaScript
- Automatically sent with WebSocket handshake requests

### 3. Token Validation
- Server validates token type, expiration, and session uniqueness
- Prevents reuse of expired or invalid tokens
- Automatic token refresh on authentication errors

## Implementation Details

### Server-Side

#### Token Generation (`/auth/ws-token`)
```typescript
POST /api/auth/ws-token
Authorization: Required (via HTTP-only cookie)
```

**Response:**
- Sets `ws_token` HTTP-only cookie
- Returns success message with expiration time

#### WebSocket Authentication
The server validates WebSocket connections by:
1. Extracting `ws_token` from cookies
2. Verifying JWT signature and expiration
3. Checking token type (`websocket`)
4. Validating session uniqueness
5. Attaching user data to socket

### Client-Side

#### Automatic Connection Management
```typescript
// WebSocket service automatically:
// 1. Fetches fresh token when needed
// 2. Connects with credentials
// 3. Handles reconnection and token refresh
// 4. Manages connection state

await wsService.connect();
```

#### Event Handling
```typescript
// Listen for real-time updates
wsService.onContactUpdate((event) => {
    switch (event.type) {
        case 'contact_created':
            // Handle new contact
            break;
        case 'contact_updated':
            // Handle contact update
            break;
        case 'contact_deleted':
            // Handle contact deletion
            break;
    }
});
```

## Token Lifecycle

1. **Login/Registration**: User authenticates, gets auth token
2. **WebSocket Connection**: Client requests WebSocket token
3. **Token Generation**: Server creates short-lived WebSocket token
4. **Connection**: Client connects using token from cookies
5. **Validation**: Server validates token and establishes connection
6. **Expiration**: Token expires after 1 hour
7. **Refresh**: Client automatically requests new token when needed

## Security Considerations

### Cookie Security
- `httpOnly`: Prevents JavaScript access
- `secure`: HTTPS only in production
- `sameSite`: Prevents CSRF attacks
- `path`: Restricts cookie scope

### Token Security
- Short expiration (1 hour)
- Unique session IDs
- Type validation (`websocket`)
- Server-side session tracking

### Connection Security
- Automatic reconnection with token refresh
- Error handling for authentication failures
- Session uniqueness enforcement

## Environment Variables

```env
# WebSocket token secret (optional, falls back to JWT_SECRET)
WS_TOKEN_SECRET=your-websocket-secret-key

# JWT secret (used as fallback for WebSocket tokens)
JWT_SECRET=your-jwt-secret-key

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# API URL
VITE_API_URL=http://localhost:3000
```

## Usage Examples

### Basic WebSocket Connection
```typescript
import { wsService } from './services/websocket.service';

// Connect automatically (handles token management)
await wsService.connect();

// Check connection status
if (wsService.isConnected()) {
    console.log('WebSocket connected');
}
```

### Real-time Event Handling
```typescript
// Listen for contact updates
wsService.onContactUpdate((event) => {
    console.log('Contact update:', event);
    
    // Refresh data or update UI
    refreshContactList();
});

// Clean up listeners
wsService.offContactUpdate(handleContactUpdate);
```

### Manual Token Refresh
```typescript
// Manually refresh WebSocket token
await wsService.refreshToken();
```

## Error Handling

The system handles various error scenarios:

1. **Token Expired**: Automatic refresh and reconnection
2. **Authentication Failed**: Redirect to login
3. **Connection Lost**: Automatic reconnection with exponential backoff
4. **Session Conflict**: New session creation

## Best Practices

1. **Always use HTTPS in production** for secure cookie transmission
2. **Monitor connection status** and provide user feedback
3. **Handle reconnection gracefully** with appropriate UI states
4. **Clean up event listeners** when components unmount
5. **Log security events** for monitoring and debugging

## Troubleshooting

### Common Issues

1. **Connection Fails**: Check if user is authenticated
2. **Token Expired**: System should auto-refresh, check logs
3. **CORS Errors**: Verify CLIENT_URL configuration
4. **Cookie Issues**: Check domain and path settings

### Debug Mode
Enable detailed logging by checking browser console and server logs for WebSocket-related messages. 