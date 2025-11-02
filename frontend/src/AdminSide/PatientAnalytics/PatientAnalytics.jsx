import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AnalyticsHeader from "./AnalyticsHeader";
import SummaryCards from "./SummaryCards";
import EyeConditionChart from "./EyeConditionChart";
import VisitGrowthChart from "./VisitGrowthChart";
import AgeGroupChart from "./AgeGroupChart";
import GeographicDistribution from "./GeographicDistribution";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
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

const PatientAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState("day");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [eyeConditions, setEyeConditions] = useState([]);
  const [visitGrowthData, setVisitGrowthData] = useState(null);
  const [ageGroups, setAgeGroups] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Timezone": userTimezone,
          },
        };

        // --- MODIFIED --- Fetch all analytics data points in parallel
        const [eyeConditionRes, visitGrowthRes, ageGroupRes, geoLocationRes] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/analytics/eye-conditions",
              headers
            ),
            axios.get(
              `http://localhost:5000/api/analytics/visit-growth?timeFrame=${timeFrame}`,
              headers
            ),
            axios.get(
              "http://localhost:5000/api/analytics/age-group-distribution",
              headers
            ),
            axios.get(
              "http://localhost:5000/api/analytics/geographic-distribution",
              headers
            ),
          ]);

        // Handle eye condition data
        setEyeConditions(
          eyeConditionRes.data && eyeConditionRes.data.length > 0
            ? eyeConditionRes.data
            : []
        );

        // Handle visit growth data
        if (visitGrowthRes.data) {
          let labels = [];
          let dataKeys = [];

          if (timeFrame === "day") {
            labels = getLast7DaysLabels();
            dataKeys = getLast7DaysKeys();
          } else if (timeFrame === "week") {
            labels = getLast7WeeksLabels();
            dataKeys = getLast7WeeksKeys();
          } else if (timeFrame === "month") {
            labels = getLast12MonthsLabels();
            dataKeys = getLast12MonthsKeys();
          }

          const data = dataKeys.map((key) => visitGrowthRes.data[key] || 0);
          setVisitGrowthData({ labels, data });
        } else {
          setVisitGrowthData(null);
        }

        setLocations(
          geoLocationRes.data && geoLocationRes.data.length > 0
            ? geoLocationRes.data
            : []
        );

        // --- NEW --- Handle age group data
        setAgeGroups(
          ageGroupRes.data && ageGroupRes.data.length > 0
            ? ageGroupRes.data
            : []
        );
      } catch (err) {
        // ... (error handling is unchanged)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  // Calculate total for percentages
  const calculateTotal = (data) =>
    data.reduce((sum, item) => sum + item.value, 0);

  // Get max value for scaling
  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 1; // Return 1 to avoid division by zero
    return Math.max(...data.map((item) => item.patients));
  };
  return (
    <div className="p-4 md:p-6 h-screen overflow-y-auto">
      <AnalyticsHeader />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- MODIFIED --- Pass dynamic data to the component */}
          {eyeConditions.length > 0 ? (
            <EyeConditionChart eyeConditions={eyeConditions} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center">
              <p className="text-gray-500">No eye condition data available.</p>
            </div>
          )}
          {visitGrowthData ? (
            <VisitGrowthChart
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              visitData={visitGrowthData}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center">
              <p className="text-gray-500">No visit growth data available.</p>
            </div>
          )}
          {ageGroups.length > 0 ? (
            <AgeGroupChart
              ageGroups={ageGroups}
              getMaxValue={() => getMaxValue(ageGroups)}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center">
              <p className="text-gray-500">
                No patient age group data available.
              </p>
            </div>
          )}
          {locations.length > 0 ? (
            <GeographicDistribution locations={locations} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center min-h-[400px]">
              <p className="text-gray-500">No geographic data available.</p>
            </div>
          )}
        </div>
      )}
      <SummaryCards loading={loading} />
    </div>
  );
};

export default PatientAnalytics;
