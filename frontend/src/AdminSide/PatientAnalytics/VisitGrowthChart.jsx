import React from "react";
import { FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";

const VisitGrowthChart = ({ timeFrame, setTimeFrame, visitData }) => {
  const chartData = {
    labels: visitData.labels,
    datasets: [
      {
        label: "Patient Visits",
        data: visitData.data,
        borderColor: "#7F0000",
        backgroundColor: "rgba(127, 0, 0, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Ensure ticks are integers since you can't have half a visit
          precision: 0,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} visits`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChartLine className="mr-2 text-deep-red" />
          Patient Visit Growth
        </h2>
        <div className="relative">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="appearance-none bg-white border border-gray-300 pl-4 pr-8 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
          >
            <option value="day">Last 7 Days</option>
            <option value="week">Last 7 Weeks</option>
            <option value="month">Last 12 Months</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaCalendarAlt />
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default VisitGrowthChart;
