import React from "react";

const SummaryCards = ({ loading }) => {
  if (loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-deep-red to-dark-red text-white rounded-2xl shadow-lg p-5">
        <div className="text-3xl font-bold">1,750</div>
        <div className="mt-2">Total Patients</div>
      </div>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-5">
        <div className="text-3xl font-bold">520</div>
        <div className="mt-2">Monthly Visits</div>
      </div>
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl shadow-lg p-5">
        <div className="text-3xl font-bold">89%</div>
        <div className="mt-2">Patient Retention</div>
      </div>
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl shadow-lg p-5">
        <div className="text-3xl font-bold">4.8/5</div>
        <div className="mt-2">Satisfaction Rate</div>
      </div>
    </div>
  );
};

export default SummaryCards;
