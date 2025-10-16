import React from "react";
import { Route, Routes } from "react-router-dom";
/*import Dashboard from "./AdminSide/adminDashboard";*/
import ProtectedRoute from "./AdminSide/AdminProtectedRoute";
import PatientProtectedRoute from "./PatientSide/PatientDashboard/PatientProtectedRoute";
import PatientAnalytics from "./AdminSide/PatientAnalytics/PatientAnalytics";
import IshiharaTest from "./PatientSide/ColorVisionTest/ColorVisionTestUI/ColorVisionTestTryUI";
import EyeCareRecordsViewer from "./PatientSide/PatientManagement/EyeCareRecordsViewer";
import AdminLoginLayout from "./AdminSide/AdminLoginUI/LoginLayout";
import PatientLoginLayout from "./PatientSide/PatientLoginAndSignUp/PatientLoginLayout";
import DashboardContainer from "./PatientSide/DashboardContainer";
import Appointments from "./PatientSide/AppointmentInterface/Appointment";
import PatientPortalPatientList from "./AdminSide/PatientList/PatientPortalPatientList";
import SalesAnalytics from "./AdminSide/SalesAnalytics/SalesAnalytics";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cecc-admin-login" element={<AdminLoginLayout />} />
        <Route path="/" element={<PatientLoginLayout />} />
        <Route path="/color-vision-test" element={<IshiharaTest />} />
        <Route path="/appointment" element={<Appointments />} />
        <Route path="/records" element={<EyeCareRecordsViewer />} />
        <Route
          path="/user-dashboard"
          element={
            <PatientProtectedRoute>
              <DashboardContainer />
            </PatientProtectedRoute>
          }
        />
        <Route path="/patient-analytics" element={<PatientAnalytics />} />
        <Route path="/sales-analytics" element={<SalesAnalytics />} />
        <Route
          path="/cecc-admin-dashboard"
          element={
            <ProtectedRoute>
              <PatientPortalPatientList />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </div>
  );
}

export default App;
