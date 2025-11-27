import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getLast7DaysLabels = () => {
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    labels.push(d.toLocaleString("en-US", { weekday: "short" }));
  }
  return labels;
};

const getLast7DaysKeys = () => {
  const keys = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    keys.push(`${yyyy}-${mm}-${dd}`);
  }
  return keys;
};

const PatientVisitsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitData = async () => {
      try {
        // 👇 START OF CHANGE 🚀
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Use the central 'api' instance. It handles the base URL and auth token automatically.
        const response = await instance.get(
          `/analytics/visit-growth?timeFrame=day`,
          {
            headers: {
              "X-User-Timezone": userTimezone,
            },
          }
        );

        const salesMap = response.data;
        const labels = getLast7DaysLabels();
        const dataKeys = getLast7DaysKeys();
        const data = dataKeys.map((key) => salesMap[key] || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: "Patient Visits",
              data,
              borderColor: "#7F0000",
              backgroundColor: "rgba(127, 0, 0, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching weekly visit data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: "#9ca3af", font: { size: 11 } },
        grid: { color: "#f3f4f6", borderDash: [5, 5] },
        border: { display: false },
      },
      x: {
        ticks: { color: "#9ca3af", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        displayColors: false,
        callbacks: { label: (context) => `${context.raw} visits` },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    // 🚀 MODIFIED: Container Styling
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Patient Visits</h2>
        <p className="text-xs text-gray-400">Activity over the last 7 days</p>
      </div>
      <div className="h-64 w-full flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red"></div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No visit data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientVisitsChart;
