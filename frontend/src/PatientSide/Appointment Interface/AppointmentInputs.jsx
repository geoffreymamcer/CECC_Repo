import React, { useState } from "react";
import Services from "./servicesContainer";

function AppointmentInput() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
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

    try {
      // Simulate user data (you can replace with actual user context)
      const dummyUser = {
        uid: "dummy-uid-123",
        firstName: "John",
        lastName: "Doe",
      };

      const appointmentData = {
        firstName: dummyUser.firstName,
        lastName: dummyUser.lastName,
        phoneNumber,
        emailAddress,
        service: selectedService,
        dateOfVisit,
        timeOfVisit,
        visitStatus,
        additionalNotes,
        userId: dummyUser.uid,
        createdAt: new Date(),
      };

      console.log("Simulated appointment booking:", appointmentData);
      alert("Appointment booked successfully");

      // Reset form
      setPhoneNumber("");
      setEmailAddress("");
      setSelectedService("");
      setDateOfVisit("");
      setTimeOfVisit("9 AM");
      setVisitStatus("");
      setAdditionalNotes("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointmentInputs">
      <h2 className="bookAppointmentText">BOOK YOUR APPOINTMENT</h2>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          required
          className="appointmentField phoneNumber"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="inputsContainer">
        <label className="inputLabel" htmlFor="emailAddress">
          Email Address
        </label>
        <input
          id="emailAddress"
          className="appointmentField emailAddress"
          placeholder="Enter your email"
          required
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
      </div>

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
