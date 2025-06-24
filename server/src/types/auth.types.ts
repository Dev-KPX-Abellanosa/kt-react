export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export interface JwtPayload {
    userId: string;
    email: string;
} 