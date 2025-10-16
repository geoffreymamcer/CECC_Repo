// src/components/sales/SalesOverTimeChart.jsx
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverTimeChart = ({ timeFrame, setTimeFrame }) => {
  // Mock sales data
  const salesData = {
    day: [1200, 1800, 1500, 2200, 1900, 2500, 2800],
    week: [8500, 9200, 7800, 10500, 8800, 9500, 11000],
    month: [
      42000, 48000, 39000, 51000, 45000, 49500, 52000, 48000, 51000, 55000,
      53000, 57000,
    ],
  };

  const labels = {
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    week: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  const chartData = {
    labels: labels[timeFrame],
    datasets: [
      {
        label: "Sales",
        data: salesData[timeFrame],
        borderColor: "#7F0000", // deep-red
        backgroundColor: "rgba(127, 0, 0, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales Over Time</h2>
        <div className="relative">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="appearance-none bg-white border border-gray-300 pl-4 pr-8 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent"
          >
            <option value="day">Per Day</option>
            <option value="week">Per Week</option>
            <option value="month">Per Month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <FaCalendarAlt />
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-sm">Current Period</div>
          <div className="text-xl font-bold">
            $
            {salesData[timeFrame][
              salesData[timeFrame].length - 1
            ].toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm">Previous Period</div>
          <div className="text-xl font-bold">
            $
            {salesData[timeFrame][
              salesData[timeFrame].length - 2
            ].toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverTimeChart;
