import React, { useState } from 'react';
import './AppointmentInterface.css';

const AddAppointmentModal = ({ isOpen, onClose, onAddAppointment }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAppointment(formData);
    onClose();
    setFormData({
      name: '',
      date: '',
      time: '',
      reason: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Add New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Reason:</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="submit-button">Add Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;