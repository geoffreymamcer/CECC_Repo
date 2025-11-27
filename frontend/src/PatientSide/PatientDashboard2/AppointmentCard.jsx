import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import RescheduleModal from "./RescheduleModal";
import CancelModal from "./CancelAppointmentModal";
import { useAuth } from "../../context/AuthContext";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";

const AppointmentCard = () => {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUpcomingAppointment = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user) return;
      const patientId = user.id || user._id;
      const res = await instance.get(`/appointments/${patientId}`);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingList = (res.data || []).filter(
        (appt) =>
          new Date(appt.appointmentDate) >= now &&
          appt.status?.toLowerCase() !== "cancelled"
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
      console.error("Error fetching upcoming appointment:", err);
      setError("Failed to load upcoming appointment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUpcomingAppointment();
    else setLoading(false);
  }, [user]);

  const handleReschedule = async ({ _id, date, time }) => {
    if (!_id) return;
    setActionLoading(true);
    try {
      await instance.patch(`/appointments/${_id}`, {
        appointmentDate: date,
        appointmentTime: time,
      });
      setShowReschedule(false);
      fetchUpcomingAppointment();
    } catch (err) {
      alert("Failed to reschedule appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async ({ _id, cancellationReason }) => {
    if (!_id) return;
    setActionLoading(true);
    try {
      await instance.patch(`/appointments/${_id}/status`, {
        status: "cancelled",
        cancellationReason,
      });
      setShowCancel(false);
      fetchUpcomingAppointment();
    } catch (err) {
      alert("Failed to cancel appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="bg-white h-40 rounded-3xl animate-pulse shadow-sm"></div>
    );
  if (error)
    return (
      <div className="bg-red-50 text-red-500 p-6 rounded-3xl">{error}</div>
    );

  if (!upcoming) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <div className="bg-gray-100 p-4 rounded-full mb-4 text-gray-400">
          <FiCalendar size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">No Upcoming Visits</h3>
        <p className="text-gray-500 mt-1 mb-4 text-sm">
          You're all caught up! Need to see a doctor?
        </p>
        {/* This could link to the booking page */}
      </div>
    );
  }

  const dateObj = new Date(upcoming.appointmentDate);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
      {/* Left Border Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#7F0000]"></div>

      <div className="p-6 pl-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Date Box */}
        <div className="flex-shrink-0 bg-gray-50 rounded-2xl p-4 text-center min-w-[90px] border border-gray-200">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            {monthName}
          </span>
          <span className="block text-3xl font-extrabold text-[#7F0000]">
            {dayNum}
          </span>
          <span className="block text-sm font-medium text-gray-600">
            {dayName}
          </span>
        </div>

        {/* Details */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900">
              {upcoming.serviceType || "Consultation"}
            </h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
              {upcoming.status?.toUpperCase() || "CONFIRMED"}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1.5">
              <FiClock className="text-[#7F0000]" />
              {upcoming.appointmentTime}
            </div>
            <div className="flex items-center gap-1.5">
              <FiUser className="text-[#7F0000]" />
              {upcoming.doctorName || "Dr. Philip Budiongan"}
            </div>
            <div className="flex items-center gap-1.5">
              <FiMapPin className="text-[#7F0000]" />
              {upcoming.location || "Main Clinic"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowReschedule(true)}
            className="flex-1 md:w-32 px-4 py-2 bg-[#7F0000] text-white text-sm font-bold rounded-xl hover:bg-[#600000] transition-colors shadow-md hover:shadow-lg"
          >
            Reschedule
          </button>
          <button
            onClick={() => setShowCancel(true)}
            className="flex-1 md:w-32 px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 hover:text-red-600 hover:border-red-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Modals */}
      {showReschedule && (
        <RescheduleModal
          appointment={upcoming}
          onClose={() => setShowReschedule(false)}
          onReschedule={handleReschedule}
          actionLoading={actionLoading}
        />
      )}
      {showCancel && (
        <CancelModal
          appointment={upcoming}
          onClose={() => setShowCancel(false)}
          onCancel={handleCancel}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default AppointmentCard;
