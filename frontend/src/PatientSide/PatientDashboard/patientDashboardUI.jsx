import React, { useState, useEffect } from "react";
import PatientNavBar from "./PatientDashboardNavBar";
import PatientSchedule from "./PatientScheduleContainer";
import PortalFeatures from "./PortalFeatureContainer";
import AppointmentInterface from "../Appointment Interface/AppointmentInterface";
import ProfileTab from "../PatientProfile/PatientPortalProfileTab";
import ProductInterface from "../ProductInteface/ProductLayout";

function DashboardUI() {
  const [activeNav, setActiveNav] = useState("home"); // Initialize to "home"

  return (
    <div className="portalDashboard">
      {activeNav === "home" && (
        <>
          <PatientSchedule />
          <PortalFeatures />
          {/* You might want to add more components here for your home view */}
        </>
      )}

      {activeNav === "appointments" && <AppointmentInterface />}

      {/* Add other views here as needed */}
      {activeNav === "products" && <ProductInterface />}
      {activeNav === "profile" && <ProfileTab />}

      <PatientNavBar activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

export default DashboardUI;
