import React, { useState, useEffect } from "react";
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

const PatientAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState("month");
  const [loading, setLoading] = useState(true);

  // Mock data for eye conditions
  const eyeConditions = [
    { name: "Myopia", value: 35, color: "#7F0000" },
    { name: "Hyperopia", value: 20, color: "#8B0000" },
    { name: "Astigmatism", value: 18, color: "#A52A2A" },
    { name: "Presbyopia", value: 15, color: "#B22222" },
    { name: "Cataracts", value: 8, color: "#CD5C5C" },
    { name: "Glaucoma", value: 4, color: "#DC143C" },
  ];

  // Mock data for patient visits
  const visitData = {
    day: [12, 19, 15, 25, 18, 22, 30],
    week: [85, 92, 78, 105, 88, 95, 110],
    month: [420, 480, 390, 510, 450, 495, 520, 480, 510, 550, 530, 570],
  };

  // Mock data for age groups
  const ageGroups = [
    { age: "0-18", patients: 120 },
    { age: "19-30", patients: 320 },
    { age: "31-45", patients: 450 },
    { age: "46-60", patients: 380 },
    { age: "61+", patients: 280 },
  ];

  // Mock data for geographic distribution
  const locations = [
    { city: "Downtown", patients: 420, percentage: 25 },
    { city: "North District", patients: 380, percentage: 22 },
    { city: "South Suburbs", patients: 320, percentage: 19 },
    { city: "West Hills", patients: 280, percentage: 16 },
    { city: "East Valley", patients: 220, percentage: 13 },
    { city: "Central", patients: 120, percentage: 7 },
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Calculate total for percentages
  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  // Get max value for scaling
  const getMaxValue = (data) => {
    return Math.max(...data.map((item) => item.patients));
  };

  return (
    <div className="p-4 md:p-6 h-screen overflow-y-auto">
      <AnalyticsHeader />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EyeConditionChart
            eyeConditions={eyeConditions}
            calculateTotal={calculateTotal}
          />
          <VisitGrowthChart
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            visitData={visitData}
          />
          <AgeGroupChart ageGroups={ageGroups} getMaxValue={getMaxValue} />
          <GeographicDistribution locations={locations} />
        </div>
      )}
      <SummaryCards loading={loading} />
    </div>
  );
};

export default PatientAnalytics;
