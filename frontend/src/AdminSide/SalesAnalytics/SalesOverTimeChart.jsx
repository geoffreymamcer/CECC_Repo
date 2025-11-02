import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported
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
  Filler, // Import Filler for the background color
} from "chart.js";
import { Line } from "react-chartjs-2";

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

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
}

// --- Last 7 Days ---
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

// --- Last 7 Weeks ---
const getLast7WeeksLabels = () => {
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    const [year, weekNo] = getWeekNumber(d);
    labels.push(`W${weekNo}`);
  }
  return labels;
};

const getLast7WeeksKeys = () => {
  const keys = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    const [year, weekNo] = getWeekNumber(d);
    // Format as YYYY-WW (e.g., "2025-43") to match the backend's %Y-%U format
    keys.push(`${year}-${String(weekNo - 1).padStart(2, "0")}`);
  }
  return keys;
};

// --- Last 12 Months ---
const getLast12MonthsLabels = () => {
  const labels = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toLocaleString("en-US", { month: "short" }));
  }
  return labels;
};

const getLast12MonthsKeys = () => {
  const keys = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    // Format as YYYY-MM (e.g., "2025-10") to match the backend's %Y-%m format
    keys.push(`${yyyy}-${mm}`);
  }
  return keys;
};

const SalesOverTimeChart = () => {
  const [timeFrame, setTimeFrame] = useState("day");
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState({ current: 0, previous: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await axios.get(
          `http://localhost:5000/api/invoices/analytics/sales-over-time?timeFrame=${timeFrame}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-User-Timezone": userTimezone,
            },
          }
        );

        const salesMap = response.data;

        // --- THIS IS THE UPDATED LOGIC ---
        let labels = [];
        let dataKeys = [];

        if (timeFrame === "day") {
          labels = getLast7DaysLabels();
          dataKeys = getLast7DaysKeys();
        } else if (timeFrame === "week") {
          labels = getLast7WeeksLabels();
          dataKeys = getLast7WeeksKeys(); // Now uses the complete function
        } else if (timeFrame === "month") {
          labels = getLast12MonthsLabels();
          dataKeys = getLast12MonthsKeys(); // Now uses the complete function
        }

        const data = dataKeys.map((key) => salesMap[key] || 0);

        if (data.length === 0 && Object.keys(salesMap).length === 0) {
          throw new Error("No sales data available for this period.");
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Sales",
              data,
              borderColor: "#7F0000",
              backgroundColor: "rgba(127, 0, 0, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        const currentPeriodSales = data[data.length - 1] || 0;
        const previousPeriodSales = data[data.length - 2] || 0;
        setSummary({
          current: currentPeriodSales,
          previous: previousPeriodSales,
        });
      } catch (err) {
        console.error(`Error fetching sales for ${timeFrame}:`, err);
        setError(err.message || "Could not load sales data.");
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [timeFrame]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (context) => `₱${context.raw.toLocaleString()}` },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `₱${value.toLocaleString()}` },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn min-h-[450px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Sales Over Time</h2>
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
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep-red"></div>
          </div>
        )}
        {error && !loading && (
          <div className="flex justify-center items-center h-full text-red-500">
            {error}
          </div>
        )}
        {chartData && !loading && !error && (
          <Line data={chartData} options={options} />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-sm">Current Period</div>
          <div className="text-xl font-bold">
            ₱{summary.current.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm">Previous Period</div>
          <div className="text-xl font-bold">
            ₱{summary.previous.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverTimeChart;
