import React from 'react';

const AddAppointmentButton = ({ onClick }) => {
  return (
    <button className="add-appointment-btn" onClick={onClick}>
      <span>+</span> Add Appointment
    </button>
  );
};

export default AddAppointmentButton;