import React, { useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import axios from "axios";

const NewVisitModal = ({ isOpen, onClose, onSave, patientId }) => {
  const [visitDetails, setVisitDetails] = useState({
    patientId: patientId,
    visitDate: new Date().toISOString().split("T")[0], // Default to today
    chiefComplaint: "",
    associatedComplaint: "",
    diagnosis: "",
    treatmentPlan: "",
    doctor: "",
    prescriptions: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Basic validation
    if (!visitDetails.visitDate || !visitDetails.chiefComplaint) {
      alert("Please fill in at least the Visit Date and Chief Complaint.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/visits",
        {
          patientId: patientId,
          visitDate: visitDetails.visitDate,
          chiefComplaint: visitDetails.chiefComplaint,
          associatedComplaint: visitDetails.associatedComplaint,
          diagnosis: visitDetails.diagnosis,
          treatmentPlan: visitDetails.treatmentPlan,
          doctor: visitDetails.doctor,
          prescriptions: visitDetails.prescriptions,
          notes: visitDetails.notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Visit record added successfully!");
      if (onSave) await onSave(); // call parent's fetchVisitData after saving
      onClose();
    } catch (error) {
      console.error("Error saving visit record:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save visit record. Please try again."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Visit</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Visit Date
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={visitDetails.visitDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Assigned Doctor
                </label>
                <input
                  type="text"
                  name="doctor"
                  placeholder="Dr. Smith"
                  value={visitDetails.doctor}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Chief Complaint
              </label>
              <input
                type="text"
                name="chiefComplaint"
                placeholder="e.g., Blurry vision"
                value={visitDetails.chiefComplaint}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Associated Complaint
              </label>
              <input
                type="text"
                name="associatedComplaint"
                placeholder="e.g., Headaches"
                value={visitDetails.associatedComplaint}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Diagnosis
              </label>
              <textarea
                name="diagnosis"
                rows="3"
                placeholder="Enter diagnosis details"
                value={visitDetails.diagnosis}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Treatment Plan
              </label>
              <textarea
                name="treatmentPlan"
                rows="3"
                placeholder="Enter treatment plan"
                value={visitDetails.treatmentPlan}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Prescribed Medications
              </label>
              <textarea
                name="prescriptions"
                rows="3"
                placeholder="e.g., Eye drops - 1 drop in each eye twice daily"
                value={visitDetails.prescriptions}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Notes</label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Additional notes"
                value={visitDetails.notes}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-dark-red text-dark-red rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all flex items-center"
            >
              <FaSave className="mr-2" /> Save Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisitModal;
