import React from "react";
import AdminLogIn from "./AdminSide/adminLogInUI";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./AdminSide/adminDashboard";
import ProtectedRoute from "./AdminSide/AdminProtectedRoute";
import PatientLogInUI from "./PatientSide/LoginAndSignUp/patientLogIn";
import DashboardUI from "./PatientSide/PatientDashboard/patientDashboardUI";
import PatientProtectedRoute from "./PatientSide/PatientDashboard/PatientProtectedRoute";
import PatientSignUp from "./PatientSide/LoginAndSignUp/patientSignUp";
import PatientAnalytics from "./AdminSide/PatientAnalytics/PatientAnalytics";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cecc-admin-login" element={<AdminLogIn />} />
        <Route path="/" element={<PatientLogInUI />} />
        <Route path="/patient-signup" element={<PatientSignUp />} />
        <Route
          path="/user-dashboard"
          element={
            <PatientProtectedRoute>
              <DashboardUI />
            </PatientProtectedRoute>
          }
        />
        <Route path="/patient-analytics" element={<PatientAnalytics />} />
        <Route
          path="/cecc-admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </div>
  );
}

export default App;
