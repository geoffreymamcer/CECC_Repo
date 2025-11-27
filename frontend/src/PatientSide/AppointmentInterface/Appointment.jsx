// src/pages/Appointment.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
} from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import "../PatientDashboard2/PatientDashboard2.css";
import instance from "../../api/axios";

// --- Loading Configuration ---
const APPOINTMENT_LOADING_DURATION = 800;

const Appointments = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    date: "",
    time: "",
    notes: "",
    doctor: "",
  });
  const dateInputRef = useRef(null);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, APPOINTMENT_LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const reasons = [
    { label: "Annual Eye Exam", icon: <FiFileText /> },
    { label: "Contact Lens Fitting", icon: <FiActivity /> },
    { label: "Glasses Prescription", icon: <FiFileText /> },
    { label: "Eye Infection", icon: <FiActivity /> },
    { label: "Dry Eye Consultation", icon: <FiActivity /> },
    { label: "Other", icon: <FiFileText /> },
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
      name: "Dr. Philip Richard Budiongan",
      specialty: "General Optometrist",
      available: true,
    },
  ];

  const handleReasonSelect = (selectedReason) => {
    setShowCustomReason(selectedReason === "Other");
    setFormData({
      ...formData,
      reason: selectedReason,
      customReason: selectedReason === "Other" ? formData.customReason : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 👇 🤖 EMOJI: LOGIC FIX STARTS HERE
  // This helper function handles moving to the next step safely
  const handleNext = (e) => {
    if (e) e.preventDefault(); // Stop any form submission
    if (activeStep < 3) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ SECURITY GUARD:
    // If user is NOT on Step 3, treat "Submit" (or Enter key) as "Next"
    if (activeStep < 3) {
      handleNext();
      return;
    }
    // 👆 🤖 EMOJI: LOGIC FIX ENDS HERE

    setIsSubmitting(true);

    const appointmentData = {
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      serviceType:
        formData.reason === "Other" ? formData.customReason : formData.reason,
      notes: formData.notes,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book an appointment.");
        setIsSubmitting(false);
        return;
      }
      await instance.post("/appointments", appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
    if (!dateString) return "";
    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // --- Render Steps ---
  // (Render logic remains visually same, but button handlers below are updated)

  const renderStep1 = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* ... (Same UI content as before for Step 1) ... */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-red-100 text-deep-red p-2 rounded-lg">
            <FiActivity />
          </span>
          What can we help you with?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reasons.map((item, index) => (
            <div
              key={index}
              onClick={() => handleReasonSelect(item.label)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 group
                ${
                  formData.reason === item.label
                    ? "border-deep-red bg-red-50 shadow-md transform scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-red-200 hover:shadow-lg"
                }`}
            >
              <div
                className={`text-2xl ${
                  formData.reason === item.label
                    ? "text-deep-red"
                    : "text-gray-400 group-hover:text-deep-red"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`font-medium text-sm ${
                  formData.reason === item.label
                    ? "text-deep-red"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {showCustomReason && (
          <div className="mt-4 animate-fadeIn">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Please specify reason
            </label>
            <input
              type="text"
              name="customReason"
              value={formData.customReason}
              onChange={handleChange}
              placeholder="E.g., Redness in left eye..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-red focus:border-transparent outline-none transition-all"
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-red-100 text-deep-red p-2 rounded-lg">
            <FaUserMd />
          </span>
          Choose a Specialist (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setFormData({ ...formData, doctor: doctor.id })}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4
                ${
                  formData.doctor === doctor.id
                    ? "border-deep-red bg-white shadow-lg ring-1 ring-deep-red"
                    : "border-gray-100 bg-white hover:border-red-200 hover:shadow-md"
                }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xl">
                <FaUserMd />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{doctor.name}</h4>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
              {formData.doctor === doctor.id && (
                <div className="absolute top-4 right-4 text-deep-red text-xl">
                  <FiCheckCircle />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* ... (Same UI content as before for Step 2) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-deep-red" /> Select Date
          </label>
          <div className="relative group">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-red focus:bg-white outline-none transition-all cursor-pointer font-medium text-gray-700"
              required
              ref={dateInputRef}
            />
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-deep-red transition-colors text-xl pointer-events-none" />
          </div>
          {formData.date && (
            <div className="mt-4 p-3 bg-red-50 text-deep-red rounded-lg text-sm font-medium text-center">
              📅 {formatDate(formData.date)}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiClock className="text-deep-red" /> Select Time
          </label>

          {!formData.date ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <FiCalendar className="text-3xl mb-2 opacity-50" />
              <p className="text-sm">Please choose a date first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, time })}
                  className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 border
                    ${
                      formData.time === time
                        ? "bg-gradient-to-br from-deep-red to-red-900 text-white border-transparent shadow-lg transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-deep-red hover:text-deep-red"
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-red focus:border-transparent outline-none transition-all resize-none"
          placeholder="Anything else we should know?"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      {/* ... (Same UI content as before for Step 3) ... */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        <div className="bg-gradient-to-r from-deep-red to-red-900 p-6 text-white text-center relative overflow-hidden">
          <div className="overflow-y-auto absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h3 className="text-2xl font-bold relative z-10">
            Appointment Summary
          </h3>
          <p className="opacity-90 text-sm relative z-10">
            Please verify your details below
          </p>
        </div>

        <div className="p-8 space-y-6 relative">
          <div className="absolute top-[-10px] left-[-10px] w-6 h-6 bg-gray-50 rounded-full"></div>
          <div className="absolute top-[-10px] right-[-10px] w-6 h-6 bg-gray-50 rounded-full"></div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-white p-3 rounded-full shadow-sm text-deep-red text-xl">
                <FiActivity />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Service
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {getDisplayReason()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-full shadow-sm text-deep-red">
                  <FiCalendar />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="font-bold text-gray-800">
                    {formatDate(formData.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-full shadow-sm text-deep-red">
                  <FiClock />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Time
                  </p>
                  <p className="font-bold text-gray-800">{formData.time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="bg-white p-3 rounded-full shadow-sm text-deep-red text-xl">
                <FaUserMd />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Doctor
                </p>
                <p className="font-bold text-gray-800">
                  {formData.doctor
                    ? doctors.find((d) => d.id === formData.doctor)?.name
                    : "First Available Specialist"}
                </p>
              </div>
            </div>
          </div>

          {formData.notes && (
            <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                Notes
              </p>
              <p className="text-gray-600 italic text-sm">"{formData.notes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your booking experience...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-4 md:p-8 font-sans bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Schedule Your Visit
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Book an appointment with our eye care specialists in just a few
            simple steps.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12 relative max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full transform -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-deep-red -z-10 rounded-full transition-all duration-500 ease-out transform -translate-y-1/2"
            style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
          ></div>

          <div className="flex justify-between w-full">
            {[
              { id: 1, label: "Details", icon: <FiFileText /> },
              { id: 2, label: "Schedule", icon: <FiCalendar /> },
              { id: 3, label: "Confirm", icon: <FiCheckCircle /> },
            ].map((step) => (
              <div
                key={step.id}
                onClick={() => {
                  if (step.id < activeStep) setActiveStep(step.id);
                }}
                className={`flex flex-col items-center cursor-pointer group ${
                  step.id > activeStep && "pointer-events-none"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 border-4 
                  ${
                    activeStep >= step.id
                      ? "bg-deep-red border-red-100 text-white shadow-lg scale-110"
                      : "bg-white border-gray-100 text-gray-300"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-3 text-sm font-bold transition-colors duration-300
                  ${activeStep >= step.id ? "text-deep-red" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 min-h-[400px] transition-all">
            {activeStep === 1 && renderStep1()}
            {activeStep === 2 && renderStep2()}
            {activeStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                disabled={activeStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                  ${
                    activeStep === 1
                      ? "opacity-0 pointer-events-none"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <FiChevronLeft /> Back
              </button>

              {activeStep < 3 ? (
                // 👇 🤖 EMOJI: LOGIC FIX: 'handleNext' ensures this button NEVER submits the form
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 1 &&
                      (!formData.reason ||
                        (showCustomReason && !formData.customReason))) ||
                    (activeStep === 2 && (!formData.date || !formData.time))
                  }
                  className="flex items-center gap-2 px-8 py-3 bg-deep-red text-white rounded-xl font-bold hover:bg-red-900 shadow-lg shadow-red-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  Next Step <FiChevronRight />
                </button>
              ) : (
                // Only this button triggers the actual API call
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-deep-red to-red-900 text-white rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}{" "}
                  <FiCheckCircle />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scaleIn text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
              <FiCheckCircle />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-500 mb-8">
              Your appointment has been successfully scheduled. A confirmation
              email has been sent to you.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmAppointment}
                className="w-full py-3.5 bg-deep-red text-white rounded-xl font-bold hover:bg-red-900 transition-colors shadow-lg shadow-red-200"
              >
                Done
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 text-gray-500 font-bold hover:text-gray-800 transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
