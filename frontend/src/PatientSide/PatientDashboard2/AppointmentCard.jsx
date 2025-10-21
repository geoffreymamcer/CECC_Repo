// src/components/AppointmentCard.jsx (Corrected)

import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "./RescheduleModal";
import CancelModal from "./CancelAppointmentModal";
// 1. Import the useAuth hook to get the secure user state
import { useAuth } from "../../context/AuthContext";
const AppointmentCard = () => {
  // 2. Get the user object from the AuthContext
  const { user } = useAuth(); // <-- This user object is trustworthy

  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  // 3. Update the useEffect to run when the 'user' object is available
  useEffect(() => {
    const fetchUpcomingAppointment = async () => {
      try {
        // 4. Check if the user object from the context exists
        if (!user) {
          setError("Missing user session. Please log in again.");
          setLoading(false);
          return;
        }

        // 5. Get the patientId directly from the secure user object
        const patientId = user.id || user._id;
        const token = localStorage.getItem("token"); // Token is still needed for the header

        if (!patientId || !token) {
          setError("Invalid user session.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/appointments/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const now = new Date();
        const upcomingList = res.data.filter(
          (appt) =>
            new Date(appt.appointmentDate) >= now &&
            (!appt.status || appt.status.toLowerCase() !== "cancelled")
        );

        if (upcomingList.length === 0) {
          setUpcoming(null);
        } else {
          upcomingList.sort(
            (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
          );
          setUpcoming(upcomingList[0]);
        }
      } catch (err) {
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingAppointment();
  }, [user]); // <-- Dependency array now includes 'user'

  // The rest of your component remains the same...

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">Loading...</div>
    );
  }
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-red-500">
        {error}
      </div>
    );
  }
  if (!upcoming) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Upcoming Appointment
        </h3>
        <span className="text-gray-500">No upcoming appointment</span>
      </div>
    );
  }

  // Format date and time
  const dateObj = new Date(upcoming.appointmentDate);
  const dateStr = dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = upcoming.appointmentTime;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Upcoming Appointment
        </h3>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded animate-pulse">
          {upcoming.status ? upcoming.status.toUpperCase() : "PENDING"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600">Date & Time</p>
          <p className="font-medium">
            {dateStr} at {timeStr}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Doctor</p>
          <p className="font-medium">
            {upcoming.doctorName || "Philip Richard Budiongan"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Reason</p>
          <p className="font-medium">
            {upcoming.serviceType || "Annual Eye Exam"}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Location</p>
          <p className="font-medium">
            {upcoming.location || "Main Clinic - Room 205"}
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          className="px-4 py-2 bg-dark-red text-white rounded hover:bg-deep-red transition-all duration-200 transform hover:scale-[1.02]"
          onClick={() => setShowReschedule(true)}
        >
          Reschedule
        </button>
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
          onClick={() => setShowCancel(true)}
        >
          Cancel
        </button>
        {showReschedule && (
          <RescheduleModal
            appointment={upcoming}
            onClose={() => setShowReschedule(false)}
            onReschedule={async ({ _id, date, time }) => {
              if (!_id) return;
              setActionLoading(true);
              try {
                const token = localStorage.getItem("token");
                await axios.patch(
                  `http://localhost:5000/api/appointments/${_id}`,
                  { appointmentDate: date, appointmentTime: time },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                // Re-fetch appointments after rescheduling
                // This logic is now inside useEffect, but you might need a manual refresh function
                window.location.reload();
              } catch (err) {
                alert("Failed to reschedule appointment.");
              } finally {
                setActionLoading(false);
              }
            }}
          />
        )}
        {showCancel && (
          <CancelModal
            appointment={upcoming}
            onClose={() => setShowCancel(false)}
            onCancel={async ({ _id, cancellationReason }) => {
              if (!_id) return;
              setActionLoading(true);
              try {
                const token = localStorage.getItem("token");
                await axios.patch(
                  `http://localhost:5000/api/appointments/${_id}/status`,
                  { status: "cancelled", cancellationReason },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                // Re-fetch appointments after cancellation
                window.location.reload();
              } catch (err) {
                alert("Failed to cancel appointment.");
              } finally {
                setActionLoading(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
