import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { api } from "../utils/axios";

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await api.post('/auth/login', { email, password });
            const authResponse: AuthResponse = response.data;
            
            setUser(authResponse.user);
            setIsAuthenticated(true);
            
            window.location.href = "/";
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || "An error occurred during login";
            setError(errorMessage);
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await api.post('/auth/register', { email, password, name });
            const authResponse: AuthResponse = response.data;
            
            setUser(authResponse.user);
            setIsAuthenticated(true);
            
            window.location.href = "/";
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || "An error occurred during registration";
            setError(errorMessage);
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            navigate("/login");
        }
    };

    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/me');
            const userData = response.data.user;
            setUser(userData);
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return {
        isAuthenticated,
        user,
        isLoading,
        error,
        setError,
        login,
        register,
        logout,
    };
};
