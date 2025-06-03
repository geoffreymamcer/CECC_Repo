import React, { useState, useEffect } from "react";
import PatientNavBar from "./PatientDashboardNavBar";
import PatientBanner from "./PatientDashBoardBanner";
import PatientSchedule from "./PatientScheduleContainer";
import PortalFeatures from "./PortalFeatureContainer";
import AppointmentInterface from "../Appointment Interface/AppointmentInterface";
import ProfileTab from "../PatientProfile/PatientPortalProfileTab";

function DashboardUI() {
  const [firstName, setFirstName] = useState("");
  const [activeNav, setActiveNav] = useState("home"); // Initialize to "home"

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setFirstName(userData.firstName);
        
        // Log user data for debugging
        console.log('User data in dashboard:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('No user data found in localStorage');
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
      {activeNav === "profile" && <ProfileTab/>}

      <PatientNavBar activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

export default DashboardUI;
