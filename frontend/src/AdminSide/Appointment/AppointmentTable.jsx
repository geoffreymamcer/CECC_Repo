import React from 'react';
import './AppointmentInterface.css';

const AppointmentTable = ({ appointments, title, onStatusChange }) => {
  const handleCheckboxChange = (appointmentId, status) => {
    onStatusChange(appointmentId, status);
  };

  return (
    <div className="appointment-table-container">
      <h3>{title}</h3>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Appointment</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Scheduled</th>
            <th>Rescheduled</th>
            <th>Cancelled</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id}>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
              <td>{appointment.reason}</td>
              <td>{appointment.name}</td>
              <td>
                <input 
                  type="checkbox" 
                  checked={appointment.status === 'present'}
                  onChange={() => handleCheckboxChange(appointment.id, 'present')}
                />
              </td>
              <td>
                <input 
                  type="checkbox" 
                  checked={appointment.status === 'absent'}
                  onChange={() => handleCheckboxChange(appointment.id, 'absent')}
                />
              </td>
              <td>
                <input 
                  type="checkbox" 
                  checked={appointment.status === 'scheduled'}
                  onChange={() => handleCheckboxChange(appointment.id, 'scheduled')}
                />
              </td>
              <td>
                <input 
                  type="checkbox" 
                  checked={appointment.status === 'rescheduled'}
                  onChange={() => handleCheckboxChange(appointment.id, 'rescheduled')}
                />
              </td>
              <td>
                <input 
                  type="checkbox" 
                  checked={appointment.status === 'cancelled'}
                  onChange={() => handleCheckboxChange(appointment.id, 'cancelled')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;