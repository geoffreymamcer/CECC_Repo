// src/pages/Appointments.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaStethoscope,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const Appointments = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const [appointments, setAppointments] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(""); // Add error state

  // New state to hold today's and tomorrow's filtered appointments directly
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []); // Run once on component mount

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const tomorrowDate = new Date(today);
      tomorrowDate.setDate(today.getDate() + 1);
      const tyyyy = tomorrowDate.getFullYear();
      const tmm = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
      const tdd = String(tomorrowDate.getDate()).padStart(2, "0");
      const tomorrowStr = `${tyyyy}-${tmm}-${tdd}`;

      // Fetch all appointments (or filter by date on backend if possible)
      const res = await fetch(`http://localhost:5000/api/appointments`); // Fetch all or by a date range
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const allAppointments = await res.json();

      // Filter appointments on the client-side for today and tomorrow
      const filteredToday = allAppointments
        .filter((app) => {
          const appDate = new Date(app.appointmentDate)
            .toISOString()
            .split("T")[0];
          return appDate === todayStr;
        })
        .map((app) => ({
          // Map to the desired structure for rendering
          id: app._id,
          name: app.fullName,
          date: app.appointmentDate,
          time: app.appointmentTime,
          reason: app.serviceType,
          status: app.status, // Assuming status is returned by backend
        }));

      const filteredTomorrow = allAppointments
        .filter((app) => {
          const appDate = new Date(app.appointmentDate)
            .toISOString()
            .split("T")[0];
          return appDate === tomorrowStr;
        })
        .map((app) => ({
          // Map to the desired structure for rendering
          id: app._id,
          name: app.fullName,
          date: app.appointmentDate,
          time: app.appointmentTime,
          reason: app.serviceType,
          status: app.status, // Assuming status is returned by backend
        }));

      setTodayAppointments(filteredToday);
      setTomorrowAppointments(filteredTomorrow);
      setAppointments([...filteredToday, ...filteredTomorrow]); // Keep a combined list if needed elsewhere
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[new Date().getMonth()]} ${new Date().getFullYear()}`;
  };

  const getDaysInMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const today = new Date().getDate();

    const days = [];
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Add the actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today;
      const hasAppointment = appointments.some((app) => {
        const appDay = new Date(app.date).getDate(); // Extract day from appointment date
        const appMonth = new Date(app.date).getMonth(); // Extract month
        const currentMonth = new Date().getMonth(); // Current month
        return appDay === i && appMonth === currentMonth;
      });

      days.push(
        <div
          key={i}
          className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all
            ${isToday ? "bg-deep-red text-white" : ""}
            ${
              hasAppointment
                ? "border-2 border-deep-red"
                : "border border-gray-200"
            }
            hover:bg-gray-50`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  // Re-evaluate these dates as they are used to filter the *initial* static data
  // Now `todayAppointments` and `tomorrowAppointments` are populated by `fetchAppointments`
  const todayDateStr = new Date().toISOString().split("T")[0];
  const tomorrowDateStr = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: appointmentData.name,
          appointmentDate: appointmentData.date,
          appointmentTime: appointmentData.time,
          serviceType: appointmentData.reason,
          status: "scheduled", // Default status for new appointments
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newApp = await res.json(); // Get the newly created appointment from the backend

      // Refresh all appointments after adding
      fetchAppointments();
      setShowAddModal(false);
      setAppointmentData({ name: "", date: "", time: "", reason: "" });
    } catch (err) {
      console.error("Failed to add appointment:", err);
      setError("Failed to add appointment. Please try again.");
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PATCH", // Assuming your backend has a PATCH endpoint for status
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // Refresh all appointments after updating status
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update appointment status:", err);
      setError("Failed to update appointment status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800";
      case "rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-3 text-deep-red" />
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage patient appointments and schedules
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
        >
          <FaPlus className="mr-2" /> Add Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {getCurrentMonth()}
          </h2>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

          <div className="mt-6">
            <h3 className="font-bold text-gray-800 mb-3">Appointment Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-deep-red mr-2"></div>
                <span className="text-sm">Today</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-deep-red mr-2"></div>
                <span className="text-sm">Has Appointment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2 animate-fadeIn">
          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            <button className="pb-3 px-1 font-medium border-b-2 border-deep-red text-deep-red">
              Today's Appointments
            </button>
            <button className="pb-3 px-1 font-medium text-gray-500 hover:text-gray-700">
              Tomorrow's Appointments
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              {/* Today's Appointments */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Today,{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-lg font-bold text-gray-800">
                                {appointment.name}
                              </h4>
                              <span
                                className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaClock className="mr-2 text-sm" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaStethoscope className="mr-2 text-sm" />
                              <span>{appointment.reason}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "present"
                                )
                              }
                              className={`p-2 rounded-full ${
                                appointment.status === "present"
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-500"
                              }`}
                              title="Mark as Present"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "absent"
                                )
                              }
                              className={`p-2 rounded-full ${
                                appointment.status === "absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                              }`}
                              title="Mark as Absent"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button className="text-sm text-blue-600 hover:underline">
                            Reschedule
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "cancelled"
                              )
                            }
                            className="text-sm text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                          <button className="text-sm text-gray-600 hover:underline">
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-5xl mb-4">
                      <FaCalendarAlt className="inline-block" />
                    </div>
                    <h4 className="text-xl font-medium text-gray-700">
                      No appointments scheduled for today
                    </h4>
                    <p className="text-gray-500 mt-2">
                      Click "Add Appointment" to schedule a new appointment
                    </p>
                  </div>
                )}
              </div>

              {/* Tomorrow's Appointments */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Tomorrow,{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate() + 1)
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {tomorrowAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {tomorrowAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-lg font-bold text-gray-800">
                                {appointment.name}
                              </h4>
                              <span
                                className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaClock className="mr-2 text-sm" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaStethoscope className="mr-2 text-sm" />
                              <span>{appointment.reason}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "present"
                                )
                              }
                              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-500"
                              title="Mark as Present"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "absent"
                                )
                              }
                              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                              title="Mark as Absent"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button className="text-sm text-blue-600 hover:underline">
                            Reschedule
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "cancelled"
                              )
                            }
                            className="text-sm text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                          <button className="text-sm text-gray-600 hover:underline">
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-5xl mb-4">
                      <FaCalendarAlt className="inline-block" />
                    </div>
                    <h4 className="text-xl font-medium text-gray-700">
                      No appointments scheduled for tomorrow
                    </h4>
                    <p className="text-gray-500 mt-2">
                      Click "Add Appointment" to schedule a new appointment
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Appointment
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleAddAppointment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Patient Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={appointmentData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
                        placeholder="Enter patient name"
                        required
                      />
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="date"
                      >
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={appointmentData.date}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
                          required
                        />
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="time"
                      >
                        Time
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={appointmentData.time}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
                          required
                        />
                        <FaClock className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 mb-2"
                      htmlFor="reason"
                    >
                      Reason
                    </label>
                    <div className="relative">
                      <textarea
                        id="reason"
                        name="reason"
                        value={appointmentData.reason}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
                        placeholder="Enter appointment reason"
                        rows="3"
                        required
                      ></textarea>
                      <FaStethoscope className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-lg hover:opacity-90"
                  >
                    Add Appointment
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
