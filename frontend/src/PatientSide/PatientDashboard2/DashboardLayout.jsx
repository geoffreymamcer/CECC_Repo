import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Appointments from "../AppointmentInterface/Appointment";
import AppointmentCard from "./AppointmentCard";
import MedicalRecords from "./MedicalRecords";
import ColorVisionTest from "./ColorVisionTest";
import QuickActions from "./QuickActions";
import ProductPreview from "./ProductPreview";
import ProfilePage from "../PatientProfileInterface/ProfilePage";
import ProductInterface from "../ProductInteface/ProductLayout";

const DashboardHome = () => (
  <main className="flex-1 overflow-y-auto p-4 md:p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Dashboard Overview
    </h2>
    <AppointmentCard />
    <MedicalRecords />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <ColorVisionTest />
      <QuickActions />
    </div>
    <ProductPreview />
  </main>
);

const DashboardLayout = () => {
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 ml-0 md:ml-64 bg-gray-100 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Main content below */}
        {activeNav === "home" && <DashboardHome />}
        {activeNav === "appointments" && <Appointments />}
        {activeNav === "products" && <ProductInterface />}
        {activeNav === "profile" && <ProfilePage />}
      </div>
    </div>
  );
};

export default DashboardLayout;
