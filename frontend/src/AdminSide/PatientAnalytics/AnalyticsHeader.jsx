import React from "react";
import { FaChartLine } from "react-icons/fa";

const AnalyticsHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <FaChartLine className="mr-3 text-deep-red" />
        Patient Analytics
      </h1>
      <p className="text-gray-600 mt-2">
        Insights into patient demographics, conditions, and clinic performance
      </p>
    </div>
  );
};

export default AnalyticsHeader;
