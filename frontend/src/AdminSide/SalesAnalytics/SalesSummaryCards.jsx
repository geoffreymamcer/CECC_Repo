// src/components/sales/SalesSummaryCards.jsx
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SalesSummaryCards = () => {
  const cards = [
    {
      title: "Total Revenue",
      value: "$42,580",
      change: "+12.5%",
      changeType: "increase",
      color: "from-deep-red to-dark-red",
    },
    {
      title: "Avg. Order Value",
      value: "$128.50",
      change: "+3.2%",
      changeType: "increase",
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "Items Sold",
      value: "1,248",
      change: "+8.7%",
      changeType: "increase",
      color: "from-green-600 to-green-800",
    },
    {
      title: "Return Rate",
      value: "2.8%",
      change: "-0.4%",
      changeType: "decrease",
      color: "from-purple-600 to-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-5 transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="text-3xl font-bold mb-2">{card.value}</div>
          <div className="flex justify-between items-end">
            <div>{card.title}</div>
            <div
              className={`flex items-center text-sm ${
                card.changeType === "increase"
                  ? "text-green-300"
                  : "text-yellow-300"
              }`}
            >
              {card.changeType === "increase" ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {card.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesSummaryCards;
