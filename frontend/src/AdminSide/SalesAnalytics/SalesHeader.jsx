// src/components/sales/SalesHeader.jsx
import React from "react";
import { FaChartBar } from "react-icons/fa";

const SalesHeader = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <FaChartBar className="mr-3 text-deep-red" />
        {title}
      </h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default SalesHeader;
