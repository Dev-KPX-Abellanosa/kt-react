import axios from "axios";

// Dynamic base URL based on current host and backend port
const getBaseURL = () => {
    const backendPort = import.meta.env.VITE_BACKEND_PORT || "3000";
    const currentHost = window.location.hostname;
    return `http://${currentHost}:${backendPort}`;
};

const BASE_URL = getBaseURL();

export const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Helper function to get server URL for WebSocket
export const getServerURL = () => BASE_URL;

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

