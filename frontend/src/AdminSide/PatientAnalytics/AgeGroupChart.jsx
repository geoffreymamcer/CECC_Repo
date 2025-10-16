import React from "react";
import { FaChartBar } from "react-icons/fa";

const AgeGroupChart = ({ ageGroups, getMaxValue }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
        <FaChartBar className="mr-2 text-deep-red" />
        Patient Age Groups
      </h2>

      <div className="space-y-4">
        {ageGroups.map((group, index) => {
          const maxValue = getMaxValue(ageGroups);
          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{group.age}</span>
                <span className="font-bold">{group.patients} patients</span>
              </div>
              <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-deep-red to-dark-red rounded-full transition-all duration-700 ease-in-out"
                  style={{
                    width: `${(group.patients / maxValue) * 100}%`,
                    animation: "fadeIn 0.8s ease-in-out",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgeGroupChart;
