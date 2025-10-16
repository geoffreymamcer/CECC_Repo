// src/components/sales/SalesBreakdown.jsx
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

const SalesBreakdown = () => {
  const categories = [
    { name: "Eye Examinations", revenue: 45000, cost: 15000 },
    { name: "Prescription Sales", revenue: 35000, cost: 12000 },
    { name: "Contact Lenses", revenue: 28000, cost: 9000 },
    { name: "Eye Care Products", revenue: 22000, cost: 7000 },
    { name: "Accessories", revenue: 15000, cost: 4000 },
  ];

  const chartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Revenue",
        data: categories.map((cat) => cat.revenue),
        backgroundColor: "rgba(127, 0, 0, 0.8)",
        borderColor: "rgba(127, 0, 0, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Cost",
        data: categories.map((cat) => cat.cost),
        backgroundColor: "rgba(169, 169, 169, 0.7)",
        borderColor: "rgba(169, 169, 169, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y", // Make bars horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Calculate totals
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);
  const totalCost = categories.reduce((sum, cat) => sum + cat.cost, 0);
  const netProfit = totalRevenue - totalCost;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales Breakdown</h2>
        <div className="text-sm text-gray-500">
          Profit Margin: {profitMargin}%
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-lg font-bold text-gray-800">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Cost</div>
          <div className="text-lg font-bold text-gray-800">
            ${totalCost.toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl p-4">
          <div className="text-sm opacity-90">Net Profit</div>
          <div className="text-lg font-bold">${netProfit.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SalesBreakdown;
