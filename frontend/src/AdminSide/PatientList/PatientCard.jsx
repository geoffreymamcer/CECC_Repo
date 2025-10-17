// src/components/PatientCard.jsx
import React from "react";
import { FaEye, FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const PatientCard = ({ patient, handleViewDetails }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-gradient-to-br from-deep-red to-dark-red p-1 rounded-full">
            <div className="bg-white p-1 rounded-full">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                {patient.profilePicture ? (
                  <img
                    src={patient.profilePicture}
                    alt={[
                      patient.firstName,
                      patient.middleName,
                      patient.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-2xl" />
                )}
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              patient.status === "Active"
                ? "bg-green-100 text-green-800"
                : patient.status === "Inactive"
                ? "bg-yellow-100 text-yellow-800"
                : patient.status === "New"
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {patient.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {[patient.firstName, patient.middleName, patient.lastName]
            .filter(Boolean)
            .join(" ")}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <MdDateRange className="mr-2 text-deep-red" />
          Last visit: {patient.lastVisit}
        </p>

        {/* --- MODIFIED SECTION START --- */}
        <div className="flex justify-between items-center text-xs border-t pt-4 mt-4">
          {/* Patient ID */}
          <div className="truncate pr-2">
            <span className="text-gray-500">Patient ID: </span>
            <span className="font-semibold text-gray-800">
              {patient.patientId}
            </span>
          </div>
          {/* Latest Diagnosis */}
          <div className="truncate text-right pl-2">
            <span className="text-gray-500">Latest Diagnosis: </span>
            <span className="font-semibold text-gray-800">
              {patient.latestDiagnosis}
            </span>
          </div>
        </div>
        {/* --- MODIFIED SECTION END --- */}

        <div className="mt-6">
          <button
            onClick={() => handleViewDetails(patient)}
            className="w-full px-4 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center group"
          >
            <span>View Details</span>
            <FaEye className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
