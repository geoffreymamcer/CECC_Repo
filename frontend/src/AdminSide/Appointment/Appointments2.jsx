// src/pages/Appointments.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaStethoscope,
  FaCheck,
  FaTimes,
  FaChevronRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react installed, otherwise use FaSpinner
import instance from "../../api/axios";

// --- Loading Configuration (in milliseconds) ---
const APPOINTMENTS_LOADING_DURATION = 1500;

const Appointments = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = async (dateToFetch = selectedDate) => {
    setLoading(true);
    setError("");
    try {
      const dateStr = formatDateForAPI(dateToFetch);

      // Fetch only for the selected date using your existing backend filter
      const res = await instance.get(`/appointments?date=${dateStr}`);

      const mapAppointmentData = (app) => ({
        id: app._id,
        name: app.fullName || app.patientName,
        date: app.appointmentDate,
        time: app.appointmentTime,
        reason: app.serviceType,
        status: app.status || "scheduled",
      });

      setAppointments((res.data || []).map(mapAppointmentData));
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch whenever selectedDate changes
  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  useEffect(() => {
    if (isInitialLoad && loading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, APPOINTMENTS_LOADING_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, loading]);

  // --- Helper Functions ---
  const getCurrentMonth = () => {
    return new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const handleDateClick = (day) => {
    const currentContext = new Date();
    const newDate = new Date(
      currentContext.getFullYear(),
      currentContext.getMonth(),
      day
    );

    newDate.setHours(0, 0, 0, 0);

    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const date = new Date(); // Current context
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      // Check if this day matches the Selected Date
      const isSelected =
        i === selectedDate.getDate() &&
        new Date().getMonth() === selectedDate.getMonth();

      // Check if this day is Today (for visual reference)
      const isToday =
        i === new Date().getDate() &&
        new Date().getMonth() === selectedDate.getMonth();

      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(i)}
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
            ${
              isSelected
                ? "bg-deep-red text-white shadow-lg shadow-red-200 scale-110 font-bold"
                : isToday
                ? "border-2 border-deep-red text-deep-red font-bold" // Outline for today if not selected
                : "text-gray-700 hover:bg-red-50 hover:text-deep-red"
            }
          `}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const payload = {
      fullName: appointmentData.name,
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      serviceType: appointmentData.reason,
      status: "confirmed", // Admin bookings are confirmed by default
    };

    const submitBooking = async (data) => {
      try {
        await instance.post("/appointments", data);
        fetchAppointments();
        setShowAddModal(false);
        setAppointmentData({ name: "", date: "", time: "", reason: "" });
        setError(""); // Clear any previous errors
      } catch (err) {
        if (err.response && err.response.status === 409) {
          // Soft Limit Warning
          const { message } = err.response.data;
          const confirmOverbook = window.confirm(
            `${message}\n\nClick OK to force this booking (Overbook).`
          );
          if (confirmOverbook) {
            submitBooking({ ...data, forceBooking: true });
          }
        } else {
          console.error("Failed to add appointment:", err);
          setError("Failed to add appointment.");
        }
      }
    };

    submitBooking(payload);
  };



  const updateAppointmentStatus = async (id, status) => {
    try {
      await instance.patch(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-500 border-gray-200 line-through decoration-gray-400";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // --- Components ---

  const AppointmentCard = ({ appointment }) => (
    <div className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden">
      {/* Decorative side bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          appointment.status === "present"
            ? "bg-green-500"
            : appointment.status === "absent"
            ? "bg-red-500"
            : "bg-deep-red"
        }`}
      ></div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-bold text-gray-800 group-hover:text-deep-red transition-colors">
              {appointment.name}
            </h4>
            <span
              className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full border ${getStatusStyle(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-50 text-deep-red rounded-md">
                <FaClock size={12} />
              </div>
              <span className="font-medium">{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-50 text-deep-red rounded-md">
                <FaStethoscope size={12} />
              </div>
              <span>{appointment.reason}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {appointment.status === "pending" ? (
            <>
              <button
                onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm"
                title="Confirm Appointment"
              >
                <FaCheck size={14} />
              </button>
              <button
                onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                title="Decline Appointment"
              >
                <FaTimes size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => updateAppointmentStatus(appointment.id, "present")}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors shadow-sm"
                title="Mark Present"
              >
                <FaCheck size={14} />
              </button>
              <button
                onClick={() => updateAppointmentStatus(appointment.id, "absent")}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                title="Mark Absent"
              >
                <FaTimes size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex gap-4 text-xs font-semibold text-gray-400">
          <button className="hover:text-blue-600 transition-colors">
            Reschedule
          </button>
          <button
            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
            className="hover:text-red-600 transition-colors"
          >
            Cancel
          </button>
        </div>
        <FaChevronRight
          className="text-gray-300 group-hover:translate-x-1 transition-transform"
          size={12}
        />
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto pb-24 bg-gray-50/50 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-700 tracking-tight mb-1">
            Appointments
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-deep-red transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-red-200"
        >
          <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-300">
            <FaPlus size={12} />
          </div>
          <span className="font-semibold text-sm">New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Calendar Widget (Sticky on large screens) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {getCurrentMonth()}
              </h2>
              <div className="p-2 bg-red-50 text-deep-red rounded-lg">
                <FaCalendarAlt />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 justify-items-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span
                  key={day}
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </span>
              ))}
              {renderCalendar()}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Stats for Selected Date
              </h3>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Total Patients
                </span>
                <span className="text-lg font-bold text-deep-red">
                  {appointments.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Lists */}
        <div className="xl:col-span-8">
          {isInitialLoad && loading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Loader2 className="h-12 w-12 text-deep-red animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Syncing schedules...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-8 w-1 bg-deep-red rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Schedule for{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                {appointments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {appointments.map((app) => (
                      <AppointmentCard key={app.id} appointment={app} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
                    <div className="p-4 bg-gray-50 rounded-full mb-3 text-gray-300">
                      <FaCalendarAlt size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No appointments scheduled for this date.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scaleIn overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-deep-red to-red-900 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaPlus className="text-red-300" /> New Appointment
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleAddAppointment} className="space-y-5">
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                    Patient Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={appointmentData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-red/20 focus:border-deep-red transition-all font-medium"
                      placeholder="e.g. Juan dela Cruz"
                      required
                    />
                    <FaUser className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-deep-red transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={appointmentData.date}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-red/20 focus:border-deep-red transition-all font-medium text-gray-600"
                        required
                      />
                      <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-deep-red transition-colors" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        value={appointmentData.time}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-red/20 focus:border-deep-red transition-all font-medium text-gray-600"
                        required
                      />
                      <FaClock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-deep-red transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                    Service / Reason
                  </label>
                  <div className="relative">
                    <textarea
                      name="reason"
                      value={appointmentData.reason}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-deep-red/20 focus:border-deep-red transition-all font-medium resize-none"
                      placeholder="Describe the service required..."
                      rows="3"
                      required
                    ></textarea>
                    <FaStethoscope className="absolute left-4 top-4 text-gray-400 group-focus-within:text-deep-red transition-colors" />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-deep-red text-white font-bold rounded-xl hover:bg-red-900 shadow-lg shadow-red-200 hover:shadow-xl transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
