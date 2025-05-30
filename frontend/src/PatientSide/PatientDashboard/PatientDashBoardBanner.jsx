import React, { useEffect, useState } from "react";
import "./PortalDashboard.css";

function PatientBanner({ name }) {
  const [time, setTime] = useState(new Date());
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulated fetch from alternative backend or dummy data
    const fetchAppointment = async () => {
      try {
        // Replace this with an API call or local storage retrieval
        const dummyAppointment = {
          dateOfVisit: "2025-06-03",
          timeOfVisit: "10 AM",
        };

        setAppointment(dummyAppointment);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    fetchAppointment();
  }, []);

  const getGreeting = (hour) => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting(time.getHours());

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="PortalBanner">
      <h1>
        {greeting}, {name}!
      </h1>
      <p>Your Eye Health Journey Matters to Us</p>
      {appointment && (
        <div className="appointment-info">
          <p>Your Next Appointment:</p>
          <p className="appointment-details">
            Date: {formatDate(appointment.dateOfVisit)}
          </p>
          <p className="appointment-details">Time: {appointment.timeOfVisit}</p>
        </div>
      )}
      <p className="lastLogin">Last Log in: {time.toLocaleDateString()}</p>
    </div>
  );
}

export default PatientBanner;
