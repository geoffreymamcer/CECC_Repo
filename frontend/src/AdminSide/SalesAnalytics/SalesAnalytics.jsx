// src/pages/SalesAnalytics.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext"; // <-- 1. IMPORT the useAuth hook
import { Lock } from "lucide-react"; // <-- 2. (Optional) Import a nice icon for the message
import SalesHeader from "./SalesHeader";
import SalesSummaryCards from "./SalesSummaryCards";
import ItemSalesDistribution from "./ItemSalesDistribution";
import SalesOverTimeChart from "./SalesOverTimeChart";
import SalesByAgeGroup from "./SalesByAgeGroup";
import SalesBreakdown from "./SalesBreakdown";

const SalesAnalytics = () => {
  // 3. GET THE USER AND LOADING STATE FROM OUR SECURE CONTEXT
  const { user, isLoading } = useAuth();

  // 4. HANDLE THE INITIAL LOADING STATE
  // While the context is verifying the user, we should wait.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-deep-red"></div>
      </div>
    );
  }

  // --- 5. THE CRITICAL SECURITY CHECK ---
  // If, after loading, we find the user's role is NOT 'owner',
  // we render the "Access Denied" component and stop execution here.
  if (user.role !== "owner") {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-6 text-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have the required permissions to view this page.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Please contact the clinic owner if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  // 6. IF THE CHECK PASSES, THE USER MUST BE AN OWNER
  // Only an owner will ever see this part of the code.
  // Your original component logic with static data goes here.
  return (
    <div className="p-4 md:p-6 h-screen overflow-y-auto">
      <SalesHeader
        title="Sales Analytics"
        description="Track sales performance and revenue insights"
      />

      <>
        <SalesSummaryCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ItemSalesDistribution />
          <SalesOverTimeChart
          // These props are fine to keep
          />
          <SalesByAgeGroup />
          <SalesBreakdown />
        </div>
      </>
    </div>
  );
};

export default SalesAnalytics;
