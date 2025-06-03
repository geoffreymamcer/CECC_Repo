import { Navigate } from "react-router-dom";

const PatientProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user = {};
  
  try {
    user = userString ? JSON.parse(userString) : {};
  } catch (e) {
    console.error("Error parsing user data:", e);
  }

  // If no token or user data, redirect to login
  if (!token || (!user.id && !user._id)) {  // Check for either id or _id
    console.log('Missing user session. Please log in again.');
    return <Navigate to="/" replace />;
  }

  // If user is not a patient, redirect to appropriate dashboard
  if (user.role === "admin") {
    return <Navigate to="/cecc-admin-dashboard" replace />;
  }

  return children;
};

export default PatientProtectedRoute;
