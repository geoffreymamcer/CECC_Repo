import React from "react";
import { FaChartLine } from "react-icons/fa";

const AnalyticsHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <FaChartLine className="mr-3 text-deep-red" />
        Patient Analytics
      </h1>
    </div>
  );
};

export default AnalyticsHeader;
