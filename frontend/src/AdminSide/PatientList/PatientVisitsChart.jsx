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
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.raw} visits` } },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-[#7F0000] mb-4">
        Patient Visits This Week
      </h2>
      <div className="h-64">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-deep-red"></div>
          </div>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No visit data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientVisitsChart;
