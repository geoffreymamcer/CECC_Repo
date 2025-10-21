import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthLoading } = useAuth();

  if (isLoading) {
    return <div>Loading session...</div>; // Or a spinner
  }

  if (!user || user.role !== "patient") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PatientProtectedRoute;
