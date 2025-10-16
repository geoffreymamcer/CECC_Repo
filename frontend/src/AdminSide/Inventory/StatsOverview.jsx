import React from "react";
import { Package, AlertTriangle, DollarSign } from "lucide-react";

const StatsOverview = ({ stats }) => {
  const { totalProducts, lowStockItems, totalValue } = stats;

  const displayStats = [
    { label: "Total Products", value: totalProducts, icon: Package },
    { label: "Low Stock Items", value: lowStockItems, icon: AlertTriangle },
    {
      label: "Total Value",
      value: `₱${totalValue.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {displayStats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition"
        >
          <div>
            <h3 className="text-gray-500 text-sm">{s.label}</h3>
            <p className="text-3xl font-bold text-deep-red">{s.value}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-full">
            <s.icon className="text-deep-red" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
