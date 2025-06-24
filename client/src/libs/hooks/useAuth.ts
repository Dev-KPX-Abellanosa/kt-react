import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { wait } from "../utils/wait";

export interface User {
    id: string;
    email: string;
    name: string;
}

const TOKEN_KEY = "auth_token";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            await wait(1000);
            setError(null);
            
    
            if (email === "admin@gmail.com" && password === "administrator") {
                const token = "1234567890"; 
                localStorage.setItem(TOKEN_KEY, token);
                
                const userData = {
                    id: "1",
                    email: "admin@gmail.com",
                    name: "Admin",
                };
                
                setUser(userData);
                setIsAuthenticated(true);
                navigate("/");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred during login");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            try {
                await wait(1000);
                const token = localStorage.getItem(TOKEN_KEY);
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                // TODO: Replace with actual API call to validate token
                // For now, we'll just check if the token exists
                const userData = {
                    id: "1",
                    email: "admin@gmail.com",
                    name: "Admin",
                };
                
                setUser(userData);
                setIsAuthenticated(true);
            } catch (err) {
                console.error("Token validation error:", err);
                localStorage.removeItem(TOKEN_KEY);
                setError("Session expired. Please login again.");
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, []);

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    };

    return {
        isAuthenticated,
        user,
        isLoading,
        error,
        setError,
        login,
        logout,
    };
};
