import { useState } from "react";
import { FiCalendar, FiClock, FiX } from "react-icons/fi";

const RescheduleModal = ({ appointment, onClose, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [selectedTime, setSelectedTime] = useState(appointment.time);
  
  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onReschedule({
      ...appointment,
      date: selectedDate,
      time: selectedTime
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full animate-fadeIn shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiCalendar className="mr-2 text-dark-red" />
            Reschedule Appointment
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current Appointment Info */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Appointment</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">With:</span>
            <span className="font-medium">{appointment.doctor}</span>
          </div>
        </div>

        {/* Reschedule Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                  required
                />
                <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all appearance-none"
                  required
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <FiClock className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Time Slots Visualization */}
            {selectedDate && (
              <div className="mt-2">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Available Time Slots for {new Date(selectedDate).toLocaleDateString()}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-2 text-sm rounded border transition-all ${
                        selectedTime === time 
                          ? 'bg-dark-red text-white border-dark-red' 
                          : 'bg-white border-gray-300 hover:border-dark-red'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all flex items-center justify-center"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default RescheduleModal;