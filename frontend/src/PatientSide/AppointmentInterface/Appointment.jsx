import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiEdit2, FiInfo } from "react-icons/fi";
import "../PatientDashboard2/PatientDashboard2.css";
import axios from "axios";

import { useRef } from "react";

const Appointments = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    date: "",
    time: "",
    notes: "",
  });
  const dateInputRef = useRef(null);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const reasons = [
    "Annual Eye Exam",
    "Contact Lens Fitting",
    "Glasses Prescription",
    "Eye Infection",
    "Dry Eye Consultation",
    "Other",
  ];

  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const doctors = [
    {
      id: 1,
      name: "Philip Richard Budiongan",
      specialty: "General Optemetrist",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "reason") {
      setShowCustomReason(value === "Other");
      setFormData({
        ...formData,
        [name]: value,
        customReason: value === "Other" ? formData.customReason : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare appointment data
    const appointmentData = {
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      serviceType:
        formData.reason === "Other" ? formData.customReason : formData.reason,
      notes: formData.notes,
      // Add doctor or other fields if needed
    };
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book an appointment.");
        return;
      }
      await axios.post(
        "http://localhost:5000/api/appointments",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowConfirmation(true);
    } catch (error) {
      setShowConfirmation(false);
      console.error("Error booking appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    }
  };

  const confirmAppointment = () => {
    setShowConfirmation(false);
    navigate("/user-dashboard");
  };

  const getDisplayReason = () => {
    return formData.reason === "Other"
      ? formData.customReason
      : formData.reason;
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Schedule Your Visit
        </h2>
        <p className="text-gray-600">
          Book an appointment with our eye care specialists
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-dark-red transition-all duration-500 -z-10"
            style={{ width: `${(activeStep - 1) * 50}%` }}
          ></div>

          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                activeStep >= step ? "text-dark-red" : "text-gray-400"
              }`}
              onClick={() => setActiveStep(step)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  activeStep >= step ? "bg-dark-red text-white" : "bg-gray-200"
                }`}
              >
                {step}
              </div>
              <span className="text-sm font-medium">
                {step === 1 && "Details"}
                {step === 2 && "Date & Time"}
                {step === 3 && "Confirmation"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Appointment Details */}
            <div className={`space-y-6 ${activeStep !== 1 ? "hidden" : ""}`}>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiEdit2 className="mr-2 text-dark-red" />
                  Appointment Details
                </h3>

                <div className="space-y-4">
                  {/* Reason for Visit */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                      required
                    >
                      <option value="">Select a reason</option>
                      {reasons.map((reason, index) => (
                        <option key={index} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>

                    {showCustomReason && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please specify <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customReason"
                          value={formData.customReason}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                          required={showCustomReason}
                        />
                      </div>
                    )}
                  </div>

                  {/* Doctor Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Doctor (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.doctor === doctor.id
                              ? "border-dark-red bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, doctor: doctor.id })
                          }
                        >
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">
                            {doctor.specialty}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                      placeholder="Any special requests or information the doctor should know?"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  disabled
                  className="px-6 py-2 text-gray-400 rounded-lg cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  disabled={
                    !formData.reason ||
                    (showCustomReason && !formData.customReason)
                  }
                  className="px-6 py-2 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Date & Time
                </button>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className={`space-y-6 ${activeStep !== 2 ? "hidden" : ""}`}>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  Select Date & Time
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full custom-date-input border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all appearance-none"
                        required
                        ref={dateInputRef}
                      />
                      <FiCalendar
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={() => {
                          if (dateInputRef.current) {
                            if (
                              typeof dateInputRef.current.showPicker ===
                              "function"
                            ) {
                              dateInputRef.current.showPicker();
                            } else {
                              dateInputRef.current.focus();
                            }
                          }
                        }}
                      />
                    </div>
                    {formData.date && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formatDate(formData.date)}
                      </p>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all appearance-none"
                        required
                      >
                        <option value="">Select a time</option>
                        {availableTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <FiClock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Time Slots Visualization */}
                {formData.date && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Available Time Slots for {formatDate(formData.date)}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableTimes.map((time, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-2 px-3 rounded-lg border transition-all ${
                            formData.time === time
                              ? "bg-dark-red text-white border-dark-red"
                              : "bg-white border-gray-300 hover:border-dark-red"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  disabled={!formData.date || !formData.time}
                  className="px-6 py-2 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Review & Confirm
                </button>
              </div>
            </div>

            {/* Step 3: Review & Confirm */}
            <div className={`space-y-6 ${activeStep !== 3 ? "hidden" : ""}`}>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiInfo className="mr-2 text-dark-red" />
                  Review Your Appointment
                </h3>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-4">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium">{getDisplayReason()}</span>
                    </div>

                    {formData.doctor && (
                      <div className="flex justify-between border-b pb-4">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">
                          {doctors.find((d) => d.id === formData.doctor)?.name}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-b pb-4">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {formatDate(formData.date)}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-4">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>

                    {formData.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Notes:</span>
                        <span className="font-medium text-right max-w-xs">
                          {formData.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-sm text-blue-800">
                    Your appointment request will be confirmed within 24 hours.
                    You'll receive a confirmation email with all the details.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all flex items-center justify-center"
                >
                  Confirm Booking
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fadeIn shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Appointment Scheduled!
              </h3>
              <p className="text-gray-600">
                We've sent a confirmation to your email.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between border-b pb-3 mb-3">
                <span className="text-gray-600">When:</span>
                <span className="font-medium">
                  {formatDate(formData.date)} at {formData.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">With:</span>
                <span className="font-medium">
                  {formData.doctor
                    ? doctors.find((d) => d.id === formData.doctor)?.name
                    : "Next Available Doctor"}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="button"
                onClick={confirmAppointment}
                className="px-4 py-3 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all"
              >
                View Appointment Details
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
