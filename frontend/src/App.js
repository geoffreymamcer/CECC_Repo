import React from "react";
import AdminLogIn from "./AdminSide/adminLogInUI";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./AdminSide/adminDashboard";
import ProtectedRoute from "./AdminSide/AdminProtectedRoute";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cecc-admin-login" element={<AdminLogIn />} />
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
