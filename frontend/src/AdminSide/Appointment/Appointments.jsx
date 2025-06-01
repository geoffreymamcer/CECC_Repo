import React, { useState, useEffect } from 'react';
import CalendarComponent from './CalendarComponent';
import AppointmentTable from './AppointmentTable';
import AddAppointmentModal from './AddAppointmentModal';
import './AppointmentInterface.css';


function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const tomorrowDate = new Date(today);
      tomorrowDate.setDate(today.getDate() + 1);
      const tyyyy = tomorrowDate.getFullYear();
      const tmm = String(tomorrowDate.getMonth() + 1).padStart(2, '0');
      const tdd = String(tomorrowDate.getDate()).padStart(2, '0');
      const tomorrowStr = `${tyyyy}-${tmm}-${tdd}`;

      // Fetch today's appointments
      const resToday = await fetch(`http://localhost:5000/api/appointments?date=${todayStr}`);
      const dataToday = await resToday.json();
      // Fetch tomorrow's appointments
      const resTomorrow = await fetch(`http://localhost:5000/api/appointments?date=${tomorrowStr}`);
      const dataTomorrow = await resTomorrow.json();

      setTodayAppointments(dataToday);
      setTomorrowAppointments(dataTomorrow);
    } catch (err) {
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // Status change logic for admin (to be implemented)
  const handleStatusChange = (appointmentId, status) => {
    // TODO: Implement PATCH request to backend to update status
    // After success, refresh appointments
    fetchAppointments();
  };

  // Add appointment logic (to be implemented)
  const handleAddAppointment = (newAppointment) => {
    // TODO: Implement POST request to backend to add appointment
    // After success, refresh appointments
    fetchAppointments();
  };

  // Map backend appointment fields to AppointmentTable fields
  const mapAppointments = (appointments) =>
    appointments.map(app => ({
      id: app._id,
      date: app.appointmentDate,
      time: app.appointmentTime,
      reason: app.serviceType,
      name: app.fullName,
      status: app.status
    }));

  return (
    <div className="appointment-interface">
      <div className="header">
        <h1>Appointment Management</h1>
        <button 
          className="add-appointment-button" 
          onClick={() => setIsModalOpen(true)}
        >
          + Add Appointment
        </button>
      </div>

      <div className="content-container">
        <div className="calendar-section">
          <CalendarComponent onDateSelect={setSelectedDate} />
        </div>

        <div className="tables-section">
          {loading ? (
            <div>Loading appointments...</div>
          ) : error ? (
            <div style={{color: 'red'}}>{error}</div>
          ) : (
            <>
              <AppointmentTable 
                appointments={mapAppointments(todayAppointments)} 
                title="Today's Appointments"
                onStatusChange={handleStatusChange}
              />
              <AppointmentTable 
                appointments={mapAppointments(tomorrowAppointments)} 
                title="Tomorrow's Appointments"
                onStatusChange={handleStatusChange}
              />
            </>
          )}
        </div>
      </div>

      <AddAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddAppointment={handleAddAppointment}
      />
    </div>
  );
}

export default Appointments;
