// src/components/sales/ItemSalesDistribution.jsx
import React from "react";
import { FaGlasses, FaEyeDropper, FaEye } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const ItemSalesDistribution = () => {
  const eyeItems = [
    { name: "Prescription Glasses", sales: 420, color: "#7F0000" },
    { name: "Contact Lenses", sales: 380, color: "#8B0000" },
    { name: "Sunglasses", sales: 320, color: "#A52A2A" },
    { name: "Eye Drops", sales: 280, color: "#B22222" },
    { name: "Reading Glasses", sales: 220, color: "#CD5C5C" },
    { name: "Eye Vitamins", sales: 180, color: "#DC143C" },
  ];

  const totalSales = eyeItems.reduce((sum, item) => sum + item.sales, 0);

  // Chart.js data configuration
  const chartData = {
    labels: eyeItems.map((item) => item.name),
    datasets: [
      {
        data: eyeItems.map((item) => item.sales),
        backgroundColor: eyeItems.map((item) => item.color),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
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
            const percentage = ((value / totalSales) * 100).toFixed(1);
            return `$${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Item Sales Distribution
        </h2>
        <div className="text-sm text-gray-500">
          Total: ${totalSales.toLocaleString()}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] mb-6">
        <Pie data={chartData} options={chartOptions} />
      </div>

      {/* Top Selling Item Card */}
      <div className="mt-6 bg-gradient-to-r from-deep-red to-dark-red rounded-xl p-4 text-white">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="font-bold">Top Selling Item</h3>
            <p className="text-sm opacity-90">{eyeItems[0].name}</p>
          </div>
          <div className="text-3xl font-bold">
            {Math.round((eyeItems[0].sales / totalSales) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSalesDistribution;
