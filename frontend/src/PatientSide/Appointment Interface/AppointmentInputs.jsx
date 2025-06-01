import React, { useState } from "react";
import Services from "./servicesContainer";
import axios from "axios";

function AppointmentInput() {
  const [selectedService, setSelectedService] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState("");
  const [timeOfVisit, setTimeOfVisit] = useState("9 AM");
  const [visitStatus, setVisitStatus] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleServiceSelect = (serviceLabel) => {
    setSelectedService(serviceLabel);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedService || !dateOfVisit || !timeOfVisit || !visitStatus) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book an appointment.");
        return;
      }

      // Only send appointment-specific fields
      const appointmentData = {
        appointmentDate: dateOfVisit,
        appointmentTime: timeOfVisit,
        serviceType: selectedService,
        visitStatus,
        additionalNotes,
      };

      // Book appointment (no patientId, name, or phone number in body)
      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        appointmentData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert("Appointment booked successfully!");
      // Reset form
      setSelectedService("");
      setDateOfVisit("");
      setTimeOfVisit("9 AM");
      setVisitStatus("");
      setAdditionalNotes("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointmentInputs">
      <h2 className="bookAppointmentText">BOOK YOUR APPOINTMENT</h2>

      <div className="inputsContainer">
        <label htmlFor="">Select Service</label>
        <Services onServiceSelect={handleServiceSelect} />
      </div>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="dateOfVisit">
          Preferred Date
        </label>
        <input
          className="dateOfVisit"
          id="dateOfVisit"
          type="date"
          value={dateOfVisit}
          min={new Date().toISOString().split("T")[0]} 
          onChange={(e) => setDateOfVisit(e.target.value)}
        />
      </div>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="timeOfVisit">
          Preferred Time
        </label>
        <select
          className="timeOfVisit"
          value={timeOfVisit}
          onChange={(e) => setTimeOfVisit(e.target.value)}
        >
          <option value="9 AM">9 A.M.</option>
          <option value="10 AM">10 A.M.</option>
          <option value="11 AM">11 A.M.</option>
          <option value="12 PM">12 P.M.</option>
          <option value="1 PM">1 P.M.</option>
          <option value="2 PM">2 P.M.</option>
          <option value="3 PM">3 P.M.</option>
          <option value="4 PM">4 P.M.</option>
          <option value="5 PM">5 P.M.</option>
        </select>
      </div>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="visit">
          Have you visited us before?
        </label>
        <div className="radiosInput">
          <label className="inputLabel radio">
            <input
              className="radio"
              type="radio"
              name="visit"
              value="firstTime"
              checked={visitStatus === "firstTime"}
              onChange={(e) => setVisitStatus(e.target.value)}
            />
            First Time
          </label>
          <label className="inputLabel radio">
            <input
              className="radio"
              type="radio"
              name="visit"
              value="returnee"
              checked={visitStatus === "returnee"}
              onChange={(e) => setVisitStatus(e.target.value)}
            />
            Returnee
          </label>
        </div>
      </div>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="additionalNotes">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={4}
          cols={50}
          className="additionalNotes"
          placeholder="Any additional notes or special requests..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className="bookAppointmentButton">
        Book Appointment
      </button>
    </form>
  );
}

export default AppointmentInput;
