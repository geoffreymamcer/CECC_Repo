import React, { useState } from "react";

function PatientNavBar({ activeNav, setActiveNav }) {
  return (
    <nav className="portalNavBar">
      <p
        className={`nav home ${activeNav === "home" ? "active" : ""}`}
        onClick={() => setActiveNav("home")}
      >
        <span>🏠</span>Home
      </p>
      <p
        className={`nav appointments ${
          activeNav === "appointments" ? "active" : ""
        }`}
        onClick={() => setActiveNav("appointments")}
      >
        <span>📅</span>Appointment
      </p>
      <p
        className={`nav products ${activeNav === "products" ? "active" : ""}`}
        onClick={() => setActiveNav("products")}
      >
        <span>📦</span>Products
      </p>
      <p
        className={`nav profile ${activeNav === "profile" ? "active" : ""}`}
        onClick={() => setActiveNav("profile")}
      >
        <span>🙎🏻‍♂️</span>Profile
      </p>
    </nav>
  );
}

export default PatientNavBar;
