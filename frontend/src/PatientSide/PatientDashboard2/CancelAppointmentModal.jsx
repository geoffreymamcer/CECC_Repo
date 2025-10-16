import { useState } from "react";
import { FiAlertTriangle, FiX, FiCalendar, FiClock } from "react-icons/fi";

const CancelModal = ({ appointment, onClose, onCancel }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancellationReasons = [
    "No longer needed",
    "Found another provider",
    "Financial reasons",
    "Scheduling conflict",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCancel({
      ...appointment,
      cancellationReason: reason
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full animate-fadeIn shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-red-50">
          <h3 className="text-xl font-semibold text-red-800 flex items-center">
            <FiAlertTriangle className="mr-2 text-red-600" />
            Cancel Appointment
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-red-600" />
          </button>
        </div>

        {/* Appointment Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start mb-3">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <FiCalendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                <h4 className="font-medium text-gray-800">
                    {appointment.reason} with {appointment.doctor}
                </h4>
                <p className="text-sm text-gray-600">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
                </div>
          </div>
        </div>

        {/* Cancellation Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                required
              >
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional feedback (optional)
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red transition-all"
                placeholder="Help us improve our service..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              disabled={isSubmitting}
            >
              Go Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all flex items-center justify-center"
              disabled={!reason || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CancelModal;