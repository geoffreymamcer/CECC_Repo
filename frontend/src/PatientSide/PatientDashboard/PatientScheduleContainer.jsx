import React from "react";
import "./PortalDashboard.css";

function PatientSchedule() {
  return (
    <div className="appointmentBanner">
      <div className="AppointmentContainer">
        <div className="container1">
          <h2 className="appointmentText">📅 Upcoming Appointment</h2>
          <span className="appointmentStatus">CONFIRMED</span>
        </div>
        <div className="container2">
          <div className="doctorInfo">
            <img
              className="imagePlaceholder"
              src="src/assets/profile-pic-place-holder.jpg"
            ></img>
            <h1 className="doctorName">
              Philip Richard Budiongan{" "}
              <span className="residency">Optemetry Specialist</span>
            </h1>
          </div>

          <p className="appointmentDate">Today, 2:30PM</p>
          <p className="buildingName">
            🏥 Candelaria Eye Care Clinic, Floor 2{" "}
            <span className="roomNumber">📍 Room 2</span>
          </p>
        </div>
        <div className="container3">
          <button className="rescheduleButton">Reschedule</button>
          <button className="appointmentDetailsButton">View Details</button>
        </div>
      </div>
    </div>
  );
}

export default PatientSchedule;
