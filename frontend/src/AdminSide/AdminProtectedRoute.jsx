import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
    return <div>Loading session...</div>; // Or a spinner
  }

  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return <Navigate to="/cecc-admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
