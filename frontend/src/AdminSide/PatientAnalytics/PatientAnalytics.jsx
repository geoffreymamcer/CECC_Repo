import React, { useState } from "react";
import "./PatientAnalytics.css";

// Mock data for the dashboard
const eyeConditionsData = [
  { name: "Myopia", value: 35 },
  { name: "Hyperopia", value: 20 },
  { name: "Astigmatism", value: 25 },
  { name: "Presbyopia", value: 15 },
  { name: "Cataracts", value: 5 },
];

const visitGrowthData = [
  { month: "Jan", visits: 120 },
  { month: "Feb", visits: 150 },
  { month: "Mar", visits: 180 },
  { month: "Apr", visits: 210 },
  { month: "May", visits: 240 },
  { month: "Jun", visits: 270 },
];

const ageGroupData = [
  { ageGroup: "0-18", patients: 80 },
  { ageGroup: "19-35", patients: 120 },
  { ageGroup: "36-50", patients: 150 },
  { ageGroup: "51-65", patients: 180 },
  { ageGroup: "65+", patients: 90 },
];

const geoData = [
  { city: "New York", patients: 200, lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", patients: 150, lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", patients: 120, lat: 41.8781, lng: -87.6298 },
  { city: "Houston", patients: 90, lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix", patients: 60, lat: 33.4484, lng: -112.074 },
];

const PatientAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="patient-analytics">
      <div className="header">
        <h1>Patient Analytics Dashboard</h1>
        <div className="time-range-selector">
          <button
            className={timeRange === "1m" ? "active" : ""}
            onClick={() => setTimeRange("1m")}
          >
            1M
          </button>
          <button
            className={timeRange === "3m" ? "active" : ""}
            onClick={() => setTimeRange("3m")}
          >
            3M
          </button>
          <button
            className={timeRange === "6m" ? "active" : ""}
            onClick={() => setTimeRange("6m")}
          >
            6M
          </button>
          <button
            className={timeRange === "1y" ? "active" : ""}
            onClick={() => setTimeRange("1y")}
          >
            1Y
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "detailed" ? "active" : ""}
          onClick={() => setActiveTab("detailed")}
        >
          Detailed Reports
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card condition-distribution">
          <h2>Eye Condition Distribution</h2>
          <PieChart data={eyeConditionsData} />
        </div>

        <div className="card visit-growth">
          <h2>Patient Visit Growth</h2>
          <LineChart data={visitGrowthData} />
        </div>

        <div className="card age-groups">
          <h2>Patient Age Groups</h2>
          <BarChart data={ageGroupData} />
        </div>

        <div className="card geo-map">
          <h2>Patient Geographic Distribution</h2>
          <GeoMap data={geoData} />
        </div>
      </div>
    </div>
  );
};

// Pie Chart Component
const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  // Generate pie chart segments
  const segments = data.map((item, i) => {
    const percent = (item.value / total) * 100;
    const startX = 50 + Math.cos(2 * Math.PI * cumulativePercent) * 50;
    const startY = 50 + Math.sin(2 * Math.PI * cumulativePercent) * 50;
    cumulativePercent += item.value / total;
    const endX = 50 + Math.cos(2 * Math.PI * cumulativePercent) * 50;
    const endY = 50 + Math.sin(2 * Math.PI * cumulativePercent) * 50;

    const largeArcFlag = percent > 50 ? 1 : 0;

    return {
      path: `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      color: `hsl(${(i * 360) / data.length}, 70%, 50%)`,
      name: item.name,
      percent: percent.toFixed(1),
    };
  });

  return (
    <div className="pie-chart-container">
      <svg viewBox="0 0 100 100" className="pie-chart">
        {segments.map((segment, i) => (
          <path
            key={i}
            d={segment.path}
            fill={segment.color}
            stroke="#fff"
            strokeWidth="0.5"
          />
        ))}
      </svg>
      <div className="pie-legend">
        {segments.map((segment, i) => (
          <div key={i} className="legend-item">
            <span
              className="color-box"
              style={{ backgroundColor: segment.color }}
            ></span>
            <span>
              {segment.name}: {segment.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component
const LineChart = ({ data }) => {
  const maxVisits = Math.max(...data.map((item) => item.visits));
  const minVisits = Math.min(...data.map((item) => item.visits));

  // Scale factor for the y-axis
  const scale = 100 / (maxVisits - minVisits);

  // Generate path data for the line
  const pathData = data
    .map((item, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (item.visits - minVisits) * scale;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="line-chart-container">
      <svg viewBox="0 0 100 100" className="line-chart">
        {/* X-axis */}
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="100"
          stroke="#800000"
          strokeWidth="0.5"
        />

        {/* Y-axis */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          stroke="#800000"
          strokeWidth="0.5"
        />

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={100 - y}
            x2="100"
            y2={100 - y}
            stroke="#800000"
            strokeWidth="0.2"
            strokeDasharray="2,2"
          />
        ))}

        {/* Data line */}
        <path
          d={pathData}
          fill="none"
          stroke="#800000"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((item, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (item.visits - minVisits) * scale;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="2" fill="#800000" />
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                fontSize="3"
                fill="#800000"
              >
                {item.visits}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((item, i) => {
          const x = (i / (data.length - 1)) * 100;
          return (
            <text
              key={i}
              x={x}
              y="105"
              textAnchor="middle"
              fontSize="3"
              fill="#800000"
            >
              {item.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ data }) => {
  const maxPatients = Math.max(...data.map((item) => item.patients));

  return (
    <div className="bar-chart-container">
      <svg viewBox="0 0 100 100" className="bar-chart">
        {/* X-axis */}
        <line
          x1="0"
          y1="90"
          x2="100"
          y2="90"
          stroke="#800000"
          strokeWidth="0.5"
        />

        {/* Y-axis */}
        <line
          x1="0"
          y1="10"
          x2="0"
          y2="90"
          stroke="#800000"
          strokeWidth="0.5"
        />

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={90 - y * 0.8}
            x2="100"
            y2={90 - y * 0.8}
            stroke="#800000"
            strokeWidth="0.2"
            strokeDasharray="2,2"
          />
        ))}

        {/* Bars */}
        {data.map((item, i) => {
          const barWidth = 80 / data.length;
          const barHeight = (item.patients / maxPatients) * 80;
          const x = 10 + i * (barWidth + 2);
          const y = 90 - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#800000"
                rx="1"
              />
              <text
                x={x + barWidth / 2}
                y={y - 2}
                textAnchor="middle"
                fontSize="3"
                fill="#800000"
              >
                {item.patients}
              </text>
              <text
                x={x + barWidth / 2}
                y="95"
                textAnchor="middle"
                fontSize="3"
                fill="#800000"
              >
                {item.ageGroup}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Geo Map Component (simplified)
const GeoMap = ({ data }) => {
  // This is a simplified version - in a real app you'd use a proper mapping library
  return (
    <div className="geo-map-container">
      <div className="map-placeholder">
        <div className="map-title">Patient Locations</div>
        <div className="map-points">
          {data.map((city, i) => (
            <div
              key={i}
              className="map-point"
              style={{
                left: `${(city.lng + 180) / 3.6}%`,
                top: `${(90 - city.lat) / 1.8}%`,
                width: `${Math.sqrt(city.patients) / 2}px`,
                height: `${Math.sqrt(city.patients) / 2}px`,
              }}
              title={`${city.city}: ${city.patients} patients`}
            ></div>
          ))}
        </div>
      </div>
      <div className="map-legend">
        {data.map((city, i) => (
          <div key={i} className="legend-item">
            <span className="color-box"></span>
            <span>
              {city.city}: {city.patients}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAnalytics;
