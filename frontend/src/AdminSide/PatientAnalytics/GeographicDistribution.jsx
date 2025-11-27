import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const GeographicDistribution = ({ locations }) => {
  const topLocation =
    locations.length > 0
      ? locations.reduce(
          (max, loc) => (loc.patients > max.patients ? loc : max),
          locations[0]
        )
      : null;

  const mapCenter = topLocation
    ? [topLocation.lat, topLocation.lng]
    : [14.5995, 120.9842]; // Default to Manila if no data

  const calculateRadius = (patients) => {
    return 4 + Math.sqrt(patients) * 2;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
        <FaMapMarkedAlt className="mr-2 text-deep-red" />
        Patient Geographic Distribution
      </h2>

      {/* Progress Bar Section (Unchanged) */}
      <div className="space-y-4 mb-8">
        {locations.slice(0, 5).map(
          (
            location,
            index // Show top 5 for brevity
          ) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm font-medium truncate">
                {location.city}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-deep-red to-dark-red rounded-full"
                    style={{ width: `${location.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-24 text-right font-bold text-sm">
                {location.patients} ({location.percentage}%)
              </div>
            </div>
          )
        )}
      </div>

      {/* --- MODIFIED --- Interactive Map Section --- */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-gray-800">
              Patient Distribution Map
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Circles are sized by patient count
            </p>
          </div>
          {/* The "View Map" button is no longer necessary as the map is always visible */}
        </div>
        <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-dashed">
          <MapContainer
            center={mapCenter}
            zoom={10}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <CircleMarker
                key={location.city}
                center={[location.lat, location.lng]}
                radius={calculateRadius(location.patients)}
                pathOptions={{
                  color: "#7F0000", // deep-red
                  fillColor: "#8B0000", // dark-red
                  fillOpacity: 0.7,
                }}
              >
                <Tooltip>
                  <strong>{location.city}</strong>
                  <br />
                  {location.patients} Patients ({location.percentage}%)
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;
