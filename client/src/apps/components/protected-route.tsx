import { Navigate } from "react-router";
import { useAuth } from "../../libs/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
}
