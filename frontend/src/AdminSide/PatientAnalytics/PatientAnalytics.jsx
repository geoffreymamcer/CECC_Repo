import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
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
import ClinicalCorrelationChart from "./ClinicalCorrelationChart";
import PeakHoursChart from "./PeakHoursChart";
import ServiceDistributionChart from "./ServiceDistributionChart";

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
  const [correlationData, setCorrelationData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const [
          eyeConditionRes,
          visitGrowthRes,
          ageGroupRes,
          geoLocationRes,
          correlationRes,
          peakHoursRes,
          serviceRes,
        ] = await Promise.all([
          instance.get("/analytics/eye-conditions"),
          instance.get(`/analytics/visit-growth?timeFrame=${timeFrame}`, {
            headers: { "X-User-Timezone": userTimezone },
          }),
          instance.get("/analytics/age-group-distribution"),
          instance.get("/analytics/geographic-distribution"),
          instance.get("/analytics/clinical-correlation"),
          instance.get("/analytics/peak-hours"),
          instance.get("/analytics/service-distribution"),
        ]);

        setEyeConditions(eyeConditionRes.data || []);
        setAgeGroups(ageGroupRes.data || []);
        setLocations(geoLocationRes.data || []);
        setCorrelationData(correlationRes.data || []);
        setPeakHoursData(peakHoursRes.data || []);
        setServiceData(serviceRes.data || []);

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
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  const getMaxValue = (data) => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((item) => item.patients));
  };

  return (
    <div className="p-4 md:p-6 h-screen overflow-y-auto bg-gray-50/50">
      <AnalyticsHeader />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Top Row: Visit Growth & Service Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VisitGrowthChart
                timeFrame={timeFrame}
                setTimeFrame={setTimeFrame}
                visitData={visitGrowthData}
              />
            </div>
            <div>
              <ServiceDistributionChart data={serviceData} />
            </div>
          </div>

          {/* Middle Row: Eye Conditions & Age Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EyeConditionChart eyeConditions={eyeConditions} />
            <AgeGroupChart
              ageGroups={ageGroups}
              getMaxValue={() => getMaxValue(ageGroups)}
            />
          </div>

          {/* Deep Insight Row: Clinical Correlation & Maps */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             <ClinicalCorrelationChart data={correlationData} />
             <GeographicDistribution locations={locations} />
          </div>

          {/* Operational Insight: Peak Hours (Full Width) */}
          <div className="w-full">
            <PeakHoursChart data={peakHoursData} />
          </div>
        </div>
      )}
      <div className="mt-8">
        <SummaryCards loading={loading} />
      </div>
    </div>
  );
};

export default PatientAnalytics;
