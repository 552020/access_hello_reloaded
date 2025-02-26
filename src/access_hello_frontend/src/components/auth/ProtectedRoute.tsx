import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
