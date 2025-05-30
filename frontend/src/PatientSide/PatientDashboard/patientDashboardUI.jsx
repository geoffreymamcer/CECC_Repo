import React, { useState, useEffect } from "react";
import PatientNavBar from "./PatientDashboardNavBar";
import PatientBanner from "./PatientDashBoardBanner";
import PatientSchedule from "./PatientScheduleContainer";
import PortalFeatures from "./PortalFeatureContainer";
import AppointmentInterface from "../Appointment Interface/AppointmentInterface";

function DashboardUI() {
  const [firstName, setFirstName] = useState("");
  const [activeNav, setActiveNav] = useState("home"); // Initialize to "home"

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFirstName(userData.firstName);
    }
  }, []);

  return (
    <div className="portalDashboard">
      {activeNav === "home" && (
        <>
          <PatientBanner firstName={firstName} />
          <PatientSchedule />
          <PortalFeatures />
          {/* You might want to add more components here for your home view */}
        </>
      )}

      {activeNav === "appointments" && <AppointmentInterface />}

      {/* Add other views here as needed */}
      {activeNav === "products" && <div>Products page here</div>}
      {activeNav === "profile" && <div>Profile page here</div>}

      <PatientNavBar activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

export default DashboardUI;
