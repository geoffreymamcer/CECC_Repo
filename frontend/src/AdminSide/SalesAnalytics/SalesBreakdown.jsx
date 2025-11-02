import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesBreakdown = () => {
  // --- NEW --- State for dynamic data
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreakdownData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/invoices/analytics/sales-breakdown",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data || response.data.length === 0) {
          throw new Error("No sales breakdown data available.");
        }
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching sales breakdown:", err);
        setError(err.message || "Could not load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdownData();
  }, []);

  // All calculations are now dynamic
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);
  const totalCost = categories.reduce((sum, cat) => sum + cat.cost, 0);
  const netProfit = totalRevenue - totalCost;
  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

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
            return `${context.dataset.label}: ₱${value.toLocaleString()}`;
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
          callback: (value) => `₱${value.toLocaleString()}`,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (error || categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[500px]">
        <h2 className="text-xl font-bold text-gray-800">Sales Breakdown</h2>
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>{error || "No data to display."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales Breakdown</h2>
        <div className="text-sm text-gray-500">
          Profit Margin: {profitMargin}%
        </div>
      </div>

      <div className="h-[300px] mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-lg font-bold text-gray-800">
            ₱{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Cost</div>
          <div className="text-lg font-bold text-gray-800">
            ₱{totalCost.toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl p-4">
          <div className="text-sm opacity-90">Net Profit</div>
          <div className="text-lg font-bold">₱{netProfit.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SalesBreakdown;
