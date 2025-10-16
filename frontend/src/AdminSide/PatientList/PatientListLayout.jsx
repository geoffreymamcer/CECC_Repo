// src/components/PatientListLayout.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "./PatientCard";
import { FaPlus } from "react-icons/fa";
import { MdPeople } from "react-icons/md";

const PatientListLayout = ({
  patients: propPatients,
  handleViewDetails,
  setIsAddModalOpen,
}) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profiles");
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // If you want to fallback to propPatients if fetch fails, you can do:
  // const displayPatients = patients.length > 0 ? patients : propPatients;
  // For now, just use fetched patients.

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePatients = filteredPatients.filter(
    (p) => p.status === "Active"
  ).length;
  const inactivePatients = filteredPatients.filter(
    (p) => p.status === "Inactive"
  ).length;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <MdPeople className="mr-3 text-deep-red" />
              Patient List
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your patients efficiently and effectively
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Active: {activePatients}</span>
          </div>
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Inactive: {inactivePatients}</span>
          </div>
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Total: {patients.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient._id || patient.id}
            patient={patient}
            handleViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-16 h-16 rounded-full bg-gradient-to-r from-deep-red to-dark-red text-white shadow-xl flex items-center justify-center hover:scale-105 transition-all duration-300 z-20 group"
      >
        <FaPlus className="text-xl transition-transform group-hover:rotate-90" />
      </button>
    </main>
  );
};

export default PatientListLayout;
