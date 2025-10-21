// src/components/PatientListLayout.jsx
import React, { useState } from "react"; // --- REMOVED useEffect and axios ---
// We keep PatientCard and the icons
import PatientCard from "./PatientCard";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MdPeople } from "react-icons/md";

// --- ADDED `patients`, `loading`, and `error` to the props it receives ---
const PatientListLayout = ({
  patients,
  loading,
  error,
  handleViewDetails,
  setIsAddModalOpen,
}) => {
  // --- REMOVED the internal useState for patients, loading, and error ---
  // --- REMOVED the entire useEffect hook that was fetching data ---

  // We keep the searchTerm state as it's specific to this layout
  const [searchTerm, setSearchTerm] = useState("");

  // This filtering logic now works on the `patients` array passed down from the parent
  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm) {
      return true;
    }
    const term = searchTerm.toLowerCase();
    const searchableFields = [
      patient.name,
      patient.firstName,
      patient.lastName,
      patient.patientId,
      patient._id,
      patient.id,
      patient.email,
      patient.phone,
    ];
    const patientSearchDocument = searchableFields
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return patientSearchDocument.includes(term);
  });

  const activePatients = filteredPatients.filter(
    (p) => p.status === "Active"
  ).length;
  const inactivePatients = filteredPatients.filter(
    (p) => p.status === "Inactive"
  ).length;

  // Now we use the `loading` prop from the parent
  if (loading) {
    return <div className="p-6 text-center">Loading patients...</div>;
  }

  // And the `error` prop from the parent
  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* The rest of your JSX remains exactly the same */}
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
                placeholder="Search by name, ID, email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="text-gray-400 absolute left-4 top-3" />
            </div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
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
            <span>Total: {filteredPatients.length}</span>
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
