/**
 * Utility functions for cookie management
 */

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

/**
 * Set a cookie with secure defaults
 */
export function setCookie(name: string, value: string, options: {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
} = {}): void {
    const {
        maxAge = 24 * 60 * 60 * 1000, // 24 hours default
        path = '/',
        secure = window.location.protocol === 'https:',
        sameSite = 'strict'
    } = options;

    let cookie = `${name}=${value}`;
    
    if (maxAge) {
        cookie += `; max-age=${maxAge}`;
    }
    
    if (path) {
        cookie += `; path=${path}`;
    }
    
    if (secure) {
        cookie += '; secure';
    }
    
    if (sameSite) {
        cookie += `; samesite=${sameSite}`;
    }

    document.cookie = cookie;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
    document.cookie = `${name}=; max-age=0; path=${path}`;
}

/**
 * Check if WebSocket token exists and is valid
 */
export function hasWebSocketToken(): boolean {
    const wsToken = getCookie('ws_token');
    return wsToken !== null;
} 