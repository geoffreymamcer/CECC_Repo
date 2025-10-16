// src/components/sales/SalesByAgeGroup.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesByAgeGroup = () => {
  const ageGroups = [
    { group: "18-24", sales: 15000, percentage: 15 },
    { group: "25-34", sales: 25000, percentage: 25 },
    { group: "35-44", sales: 30000, percentage: 30 },
    { group: "45-54", sales: 20000, percentage: 20 },
    { group: "55+", sales: 10000, percentage: 10 },
  ];

  const totalSales = ageGroups.reduce((sum, group) => sum + group.sales, 0);

  const chartData = {
    labels: ageGroups.map((group) => group.group),
    datasets: [
      {
        label: "Sales by Age Group",
        data: ageGroups.map((group) => group.sales),
        backgroundColor: "rgba(127, 0, 0, 0.8)",
        borderColor: "rgba(127, 0, 0, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalSales) * 100).toFixed(1);
            return `$${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Find the age group with highest sales
  const topAgeGroup = ageGroups.reduce(
    (max, group) => (group.sales > max.sales ? group : max),
    ageGroups[0]
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales by Age Group</h2>
        <div className="text-sm text-gray-500">
          Total: ${totalSales.toLocaleString()}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Top Age Group Card */}
      <div className="mt-6 bg-gradient-to-r from-deep-red to-dark-red rounded-xl p-4 text-white">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="font-bold">Highest Revenue Age Group</h3>
            <p className="text-sm opacity-90">{topAgeGroup.group} years</p>
          </div>
          <div className="text-3xl font-bold">
            {Math.round((topAgeGroup.sales / totalSales) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesByAgeGroup;
