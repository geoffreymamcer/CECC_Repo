// --- START OF FILE App.js ---
import React, { Suspense, lazy } from "react"; // 👈 IMPORT lazy & Suspense
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./AdminSide/AdminProtectedRoute";
import PatientProtectedRoute from "./PatientSide/PatientDashboard/PatientProtectedRoute";
const AdminLoginLayout = lazy(() =>
  import("./AdminSide/AdminLoginUI/LoginLayout")
);
const PatientLoginLayout = lazy(() =>
  import("./PatientSide/PatientLoginAndSignUp/PatientLoginLayout")
);
const IshiharaTest = lazy(() =>
  import("./PatientSide/ColorVisionTest/ColorVisionTestUI/ColorVisionTestTryUI")
);
const Appointments = lazy(() =>
  import("./PatientSide/AppointmentInterface/Appointment")
);
const EyeCareRecordsViewer = lazy(() =>
  import("./PatientSide/PatientManagement/EyeCareRecordsViewer")
);
const DashboardContainer = lazy(() =>
  import("./PatientSide/DashboardContainer")
);
const PatientAnalytics = lazy(() =>
  import("./AdminSide/PatientAnalytics/PatientAnalytics")
);
const SalesAnalytics = lazy(() =>
  import("./AdminSide/SalesAnalytics/SalesAnalytics")
);
const PatientPortalPatientList = lazy(() =>
  import("./AdminSide/PatientList/PatientPortalPatientList")
);
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="flex flex-col items-center space-y-1 select-none">
      <span className="text-6xl font-black text-[#7F0000] animate-[pulse_2s_infinite]">
        E
      </span>

      <div className="flex gap-4 text-3xl font-bold text-gray-800 opacity-80">
        <span className="animate-[bounce_1s_infinite] delay-75">F</span>
        <span className="animate-[bounce_1s_infinite] delay-150">P</span>
      </div>

      <div className="flex gap-2 text-xl font-medium text-gray-500 opacity-60">
        <span className="animate-[pulse_1.5s_infinite] delay-100">T</span>
        <span className="animate-[pulse_1.5s_infinite] delay-200">O</span>
        <span className="animate-[pulse_1.5s_infinite] delay-300">Z</span>
      </div>
    </div>

    <div className="w-32 h-1 bg-gray-100 mt-8 rounded-full overflow-hidden">
      <div className="h-full bg-[#7F0000] animate-[translateX_1.5s_ease-in-out_infinite] w-1/2 rounded-full"></div>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
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
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
