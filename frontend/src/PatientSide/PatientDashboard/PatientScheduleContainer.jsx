import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PortalDashboard.css";

function PatientSchedule() {
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUpcomingAppointment();
    // eslint-disable-next-line
  }, []);

  const fetchUpcomingAppointment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (!user || !user.patientId || !token) {
        setError("Missing user session. Please log in again.");
        setLoading(false);
        return;
      }
      const res = await axios.get(
        `http://localhost:5000/api/appointments/${user.patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Find the next upcoming appointment (date >= today, soonest first, and not cancelled)
      const now = new Date();
      const upcomingList = res.data
        .filter((appt) => new Date(appt.appointmentDate) >= now && (!appt.status || appt.status.toLowerCase() !== 'cancelled'));
      if (upcomingList.length === 0) {
        setUpcoming(null);
      } else {
        // Sort by date/time ascending
        upcomingList.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setUpcoming(upcomingList[0]);
      }
    } catch (err) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!upcoming) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/appointments/${upcoming._id}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUpcomingAppointment();
      setShowReschedule(false);
    } catch (err) {
      setError("Failed to cancel appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!upcoming) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/appointments/${upcoming._id}`,
        {
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUpcomingAppointment();
      setShowReschedule(false);
    } catch (err) {
      setError("Failed to reschedule appointment.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="appointmentBanner">Loading...</div>;
  if (error) return <div className="appointmentBanner">{error}</div>;
  if (!upcoming)
    return (
      <div className="appointmentBanner">
        <div className="AppointmentContainer">
          <div className="container1">
            <h2 className="appointmentText">📅 Upcoming Appointment</h2>
            <span className="appointmentStatus" style={{color: 'gray'}}>No upcoming appointment</span>
          </div>
        </div>
      </div>
    );

  // Format date and time
  const dateObj = new Date(upcoming.appointmentDate);
  const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = upcoming.appointmentTime;
  return (
    <div className="appointmentBanner">
      <div className="AppointmentContainer">
        <div className="container1">
          <h2 className="appointmentText">📅 Upcoming Appointment</h2>
          <span className="appointmentStatus">{upcoming.status ? upcoming.status.toUpperCase() : 'PENDING'}</span>
        </div>
        <div className="container2">
          <div className="doctorInfo">
            <img
              className="imagePlaceholder"
              src="src/assets/profile-pic-place-holder.jpg"
              alt="Doctor profile"
            />
            <h1 className="doctorName">
              {/* Replace with actual doctor name if available */}
              Philip Richard Budiongan{" "}
              <span className="residency">Optemetry Specialist</span>
            </h1>
          </div>

          <p className="appointmentDate">{dateStr}, {timeStr}</p>
          <p className="buildingName">
            🏥 Candelaria Eye Care Clinic, Floor 2{" "}
            <span className="roomNumber">📍 Room 2</span>
          </p>
        </div>
        <div className="container3">
          {!showReschedule && (
            <>
              <button
                className="rescheduleButton"
                onClick={() => setShowReschedule(true)}
                disabled={actionLoading}
              >
                Reschedule
              </button>
              <button
                className="appointmentDetailsButton"
                onClick={handleCancel}
                disabled={actionLoading || (upcoming.status && upcoming.status.toLowerCase() === 'cancelled')}
              >
                Cancel Schedule
              </button>
            </>
          )}
        </div>
        {showReschedule && (
          <div className="rescheduleModal">
            <form onSubmit={handleReschedule} className="rescheduleForm">
              <label>
                New Date:
                <input
                  className="rescheduleDate"
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  required
                />
              </label>
              <label>
                New Time:
                <select
                  className="rescheduleTime"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  required
                >
                  <option value="">Select time</option>
                  <option value="9 AM">9 AM</option>
                  <option value="10 AM">10 AM</option>
                  <option value="11 AM">11 AM</option>
                  <option value="12 PM">12 PM</option>
                  <option value="1 PM">1 PM</option>
                  <option value="2 PM">2 PM</option>
                  <option value="3 PM">3 PM</option>
                  <option value="4 PM">4 PM</option>
                  <option value="5 PM">5 PM</option>
                </select>
              </label>
              <button type="submit" className="submitReschedule" disabled={actionLoading}>Submit</button>
              <button type="button"  className="cancelReschedule" onClick={() => setShowReschedule(false)} disabled={actionLoading}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientSchedule;
