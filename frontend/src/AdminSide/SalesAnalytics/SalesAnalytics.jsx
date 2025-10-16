// src/pages/SalesAnalytics.jsx
import React, { useState } from "react";
import SalesHeader from "./SalesHeader";
import SalesSummaryCards from "./SalesSummaryCards";
import ItemSalesDistribution from "./ItemSalesDistribution";
import SalesOverTimeChart from "./SalesOverTimeChart";
import SalesByAgeGroup from "./SalesByAgeGroup";
import SalesBreakdown from "./SalesBreakdown";

const SalesAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState("month");
  const [loading, setLoading] = useState(true);

  // Simulate loading
  setTimeout(() => setLoading(false), 800);

  return (
    <div className="p-4 md:p-6 h-screen overflow-y-auto">
      <SalesHeader
        title="Sales Analytics"
        description="Track sales performance and revenue insights"
      />

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
        </div>
      ) : (
        <>
          <SalesSummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ItemSalesDistribution />
            <SalesOverTimeChart
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <SalesByAgeGroup />
            <SalesBreakdown />
          </div>
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;
