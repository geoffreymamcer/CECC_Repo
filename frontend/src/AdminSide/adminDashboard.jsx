import React, { useState } from "react";
import { RealTimeDate, RealTimeTime } from "./date-time";
import CECCLOGO from "./AdminSideAssets/CECC-Logo.png";

import calendar from "./AdminSideAssets/calendar-days-solid.svg";
import notification from "./AdminSideAssets/bell-solid.svg";
import profile from "./AdminSideAssets/circle-user-solid.svg";
import clock from "./AdminSideAssets/clock-solid.svg";
import Input from "./InputField";
import "./AdminSide.css";
import Sidebar from "./sideBarMenu";
import PatientList from "./patient";
import PatientAnalytics from "./PatientAnalytics/PatientAnalytics";

import SalesAnalytics from "./salesAnalytics";
import Appointments from "./Appointment/Appointments";
import Inventory from "./Inventory";
import Feedbacks from "./Feedback";

import { useNavigate } from "react-router-dom";
import FloatingButton from "./floating-button";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear authentication header
      delete axios.defaults.headers.common["Authorization"];

      // Clear all auth-related items from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Navigate to login page
      navigate("/cecc-admin-login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [activeItem, setActiveItem] = useState("patient");

  const renderContent = () => {
    switch (activeItem) {
      case "patient":
        return <PatientList />;
      case "patient-analytics":
        return <PatientAnalytics />;
      case "sales-analytics":
        return <SalesAnalytics />;
      case "appointments":
        return <Appointments />;
      case "inventory":
        return <Inventory />;
      case "feedbacks":
        return <Feedbacks />;
      default:
        return <h2>Welcome to the Admin Dashboard</h2>;
    }
  };

  return (
    <div className="adminDashboardContainer">
      <header className="dashBoardHeader">
        <div className="logoContainer">
          <img className="CECClogo icon" src={CECCLOGO} alt="CECC Logo" />
        </div>
        <div className="dateTimeContainer">
          <div className="dateContainer">
            <img className="icon calendar" src={calendar} alt="Calendar Icon" />
            <RealTimeDate />
          </div>
          <div className="timeContainer">
            <img className="icon clock" src={clock} alt="Clock Icon" />
            <RealTimeTime />
          </div>
        </div>
        <div className="searchBar">
          <Input className="searchBarInput" placeholder="Search" />
        </div>
        <div className="profile-notification">
          <img
            className="icon notification"
            src={notification}
            alt="Notification Icon"
          />
          <img className="icon profile" src={profile} alt="Profile Icon" />
          <button
            className="logoutButton"
            onClick={handleLogout}
            style={{
              backgroundColor: "#8c0a14",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mainDashboard">
        <div className="dashboardSideBar">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        </div>
        <div className="dashboardMainContent">
          {renderContent()}
          <FloatingButton />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
