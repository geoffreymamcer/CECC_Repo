import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported
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

const SalesByAgeGroup = () => {
  // --- NEW --- State for dynamic data
  const [ageGroups, setAgeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgeGroupData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/invoices/analytics/by-age-group",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;
        if (!data || data.length === 0) {
          throw new Error("No sales data available by age group.");
        }
        setAgeGroups(data);
      } catch (err) {
        console.error("Error fetching sales by age group:", err);
        setError(err.message || "Could not load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgeGroupData();
  }, []);

  // --- All calculations are now dynamic ---
  const totalSales = ageGroups.reduce((sum, group) => sum + group.sales, 0);

  const chartData = {
    labels: ageGroups.map((group) =>
      group.group.replace(/:\s\d+-\d+/, "").replace(" & up", "+")
    ), // Clean up labels e.g. "Child: 0-12" -> "Child"
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
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage =
              totalSales > 0 ? ((value / totalSales) * 100).toFixed(1) : 0;
            return `₱${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true, drawBorder: false },
        ticks: { callback: (value) => `₱${value.toLocaleString()}` },
      },
      x: { grid: { display: false } },
    },
  };

  const topAgeGroup =
    ageGroups.length > 0
      ? ageGroups.reduce(
          (max, group) => (group.sales > max.sales ? group : max),
          ageGroups[0]
        )
      : null;

  // --- RENDER LOGIC ---
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center h-[450px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep-red"></div>
      </div>
    );
  }

  if (error || !topAgeGroup) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[450px]">
        <h2 className="text-xl font-bold text-gray-800">Sales by Age Group</h2>
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>{error || "No data to display."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales by Age Group</h2>
        <div className="text-sm text-gray-500">
          Total: ₱{totalSales.toLocaleString()}
        </div>
      </div>

      <div className="h-[300px] mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {topAgeGroup && (
        <div className="mt-6 bg-gradient-to-r from-deep-red to-dark-red rounded-xl p-4 text-white">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="font-bold">Highest Revenue Age Group</h3>
              <p className="text-sm opacity-90">{topAgeGroup.group}</p>
            </div>
            <div className="text-3xl font-bold">
              {totalSales > 0
                ? `${Math.round((topAgeGroup.sales / totalSales) * 100)}%`
                : "0%"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesByAgeGroup;
