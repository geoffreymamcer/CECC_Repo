import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = ["#7F0000", "#A52A2A", "#CD5C5C", "#8B0000", "#B22222"];

const PatientDemographicsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/analytics/age-group-distribution",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const ageGroups = response.data;
        if (ageGroups && ageGroups.length > 0) {
          setChartData({
            labels: ageGroups.map((g) =>
              g.age.replace(/:\s\d+-\d+/, "").replace(" & up", "+")
            ),
            datasets: [
              {
                data: ageGroups.map((g) => g.patients),
                backgroundColor: ageGroups.map(
                  (_, index) => CHART_COLORS[index % CHART_COLORS.length]
                ),
                borderColor: "#FFFFFF",
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching age group data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgeData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 15 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} patients`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#7F0000] mb-4">
        Patient Demographics by Age
      </h2>
      <div className="h-64 flex justify-center items-center">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-deep-red"></div>
        ) : chartData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p className="text-gray-500">No demographic data available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDemographicsChart;
