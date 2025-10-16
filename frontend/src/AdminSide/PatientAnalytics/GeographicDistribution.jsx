import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

const GeographicDistribution = ({ locations }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
        <FaMapMarkedAlt className="mr-2 text-deep-red" />
        Patient Geographic Distribution
      </h2>

      <div className="space-y-5">
        {locations.map((location, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm font-medium">{location.city}</div>
            <div className="flex-1 mx-4">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-deep-red to-dark-red rounded-full transition-all duration-700 ease-in-out"
                  style={{
                    width: `${location.percentage}%`,
                    animation: "fadeIn 0.8s ease-in-out",
                  }}
                ></div>
              </div>
            </div>
            <div className="w-20 text-right font-bold">
              {location.patients} ({location.percentage}%)
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-4">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">
              Patient Distribution Map
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Visual representation of patient locations
            </p>
          </div>
          <div className="bg-gradient-to-br from-deep-red to-dark-red text-white px-4 py-2 rounded-lg">
            View Map
          </div>
        </div>
        <div className="mt-4 relative">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 flex items-center justify-center">
            <div className="text-gray-500">Interactive Map Visualization</div>
          </div>

          {/* Map markers */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-deep-red border-2 border-white"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-dark-red border-2 border-white"></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 rounded-full bg-red-800 border-2 border-white"></div>
          <div className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-deep-red border-2 border-white"></div>
          <div className="absolute top-1/2 left-1/2 w-7 h-7 rounded-full bg-dark-red border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;
