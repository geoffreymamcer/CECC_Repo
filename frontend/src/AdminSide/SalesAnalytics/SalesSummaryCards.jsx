import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaFileInvoice,
} from "react-icons/fa";

// Helper to format large numbers (e.g., 1248 -> 1.2k)
const formatCompactNumber = (number) => {
  if (number < 1000) return number;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
};

const SalesSummaryCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/invoices/analytics/summary-cards",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching summary card stats:", err);
        setError("Could not load summary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  // Display a loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-28 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  // Display an error state
  if (error) {
    return (
      <div className="col-span-full bg-red-100 text-red-700 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  // Create the cards data dynamically
  const cards = [
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      Icon: FaDollarSign,
      color: "from-deep-red to-dark-red",
    },
    {
      title: "Avg. Order Value",
      value: `₱${stats.avgOrderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      Icon: FaFileInvoice,
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "Items Sold",
      value: formatCompactNumber(stats.itemsSold),
      Icon: FaShoppingCart,
      color: "from-green-600 to-green-800",
    },
    {
      title: "Total Customers", // Replaced "Return Rate"
      value: formatCompactNumber(stats.totalCustomers),
      Icon: FaUsers,
      color: "from-purple-600 to-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-80">{card.title}</span>
            <card.Icon className="opacity-50" size={20} />
          </div>
          <div className="text-3xl font-bold mt-2">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SalesSummaryCards;
