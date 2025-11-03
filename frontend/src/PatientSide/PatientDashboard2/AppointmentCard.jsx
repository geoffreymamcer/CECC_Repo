import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import RescheduleModal from "./RescheduleModal";
import CancelModal from "./CancelAppointmentModal";
import { useAuth } from "../../context/AuthContext";

const AppointmentCard = () => {
  const { user } = useAuth();

  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUpcomingAppointment = async () => {
    // Moved into its own function for re-usability
    setLoading(true);
    setError("");
    try {
      if (!user) {
        // setError("Missing user session. Please log in again.");
        return; // Don't try to fetch if there's no user
      }

      const patientId = user.id || user._id;
      if (!patientId) {
        setError("Invalid user session.");
        return;
      }

      // --- 2. USE THE API INSTANCE ---
      // The Authorization header is now handled automatically by the instance
      const res = await instance.get(`/appointments/${patientId}`);

      const now = new Date();
      // Filter for appointments that are in the future and not cancelled
      const upcomingList = (res.data || []).filter(
        (appt) =>
          new Date(appt.appointmentDate) >= now &&
          appt.status?.toLowerCase() !== "cancelled"
      );

      if (upcomingList.length === 0) {
        setUpcoming(null);
      } else {
        // Sort to find the very next appointment
        upcomingList.sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        setUpcoming(upcomingList[0]);
      }
    } catch (err) {
      console.error("Error fetching upcoming appointment:", err);
      setError("Failed to load upcoming appointment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if the user object is available
    if (user) {
      fetchUpcomingAppointment();
    } else {
      setLoading(false); // If no user, we're done loading
    }
  }, [user]);

  const handleReschedule = async ({ _id, date, time }) => {
    if (!_id) return;
    setActionLoading(true);
    try {
      // --- 3. USE THE API INSTANCE ---
      await instance.patch(`/appointments/${_id}`, {
        appointmentDate: date,
        appointmentTime: time,
      });
      setShowReschedule(false);
      fetchUpcomingAppointment(); // Re-fetch data instead of reloading the page
    } catch (err) {
      console.error("Failed to reschedule:", err);
      alert("Failed to reschedule appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async ({ _id, cancellationReason }) => {
    if (!_id) return;
    setActionLoading(true);
    try {
      // --- 4. USE THE API INSTANCE ---
      await instance.patch(`/appointments/${_id}/status`, {
        status: "cancelled",
        cancellationReason,
      });
      setShowCancel(false);
      fetchUpcomingAppointment(); // Re-fetch data instead of reloading the page
    } catch (err) {
      console.error("Failed to cancel:", err);
      alert("Failed to cancel appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
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
        <span className="text-gray-500">
          No upcoming appointment scheduled.
        </span>
      </div>
    );
  }

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
          {upcoming.status ? upcoming.status.toUpperCase() : "SCHEDULED"}
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
        </div>{" "}
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
            onReschedule={handleReschedule} // Use the new handler
            actionLoading={actionLoading}
          />
        )}
        {showCancel && (
          <CancelModal
            appointment={upcoming}
            onClose={() => setShowCancel(false)}
            onCancel={handleCancel} // Use the new handler
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
