import React, { useState } from 'react';
import './AppointmentInterface.css';

const CalendarComponent = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = selectedDate.getDate() === day && 
                         selectedDate.getMonth() === currentDate.getMonth() && 
                         selectedDate.getFullYear() === currentDate.getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-days">
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarComponent;