import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define a consistent color palette using your theme
const CHART_COLORS = [
  "#7F0000", // deep-red
  "#A52A2A", // Brown
  "#CD5C5C", // Indian Red
  "#DC143C", // Crimson
  "#C71585", // Medium Violet Red
  "#DB7093", // Pale Violet Red
  "#8B0000", // dark-red
  "#B22222", // Firebrick
];

const ItemSalesDistribution = () => {
  const [chartData, setChartData] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [topItem, setTopItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await instance.get(
          "/invoices/analytics/item-distribution"
        );

        const salesData = response.data;
        if (!salesData || salesData.length === 0) {
          throw new Error("No sales data available to display.");
        }

        const total = salesData.reduce((sum, item) => sum + item.sales, 0);
        setTotalSales(total);
        setTopItem(salesData[0]);

        setChartData({
          labels: salesData.map((item) => item.name),
          datasets: [
            {
              data: salesData.map((item) => item.sales),
              backgroundColor: salesData.map(
                (_, index) => CHART_COLORS[index % CHART_COLORS.length]
              ),
              borderColor: "#FFFFFF",
              borderWidth: 2,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching item sales distribution:", err);
        setError(err.message || "Could not load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // --- THIS IS THE KEY CHANGE ---
      // We disable the default legend to create our own custom one.
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage =
              totalSales > 0 ? ((value / totalSales) * 100).toFixed(1) : 0;
            return `₱${Number(value).toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-deep-red"></div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[500px]">
        <h2 className="text-xl font-bold text-gray-800">
          Item Sales Distribution
        </h2>
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>{error || "No data to display."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Item Sales Distribution
        </h2>
        <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
          Total: ₱{totalSales.toLocaleString()}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[250px] w-full flex justify-center items-center mx-auto mb-6">
        <Pie data={chartData} options={chartOptions} />
      </div>

      {/* --- NEW --- Custom Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 px-4">
        {chartData.labels.map((label, index) => (
          <div key={label} className="flex items-center">
            <span
              className="h-3 w-3 rounded-full mr-2"
              style={{
                backgroundColor: chartData.datasets[0].backgroundColor[index],
              }}
            ></span>
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {/* --- MODIFIED --- Top Selling Item Card */}
      {topItem && (
        <div className="mt-8 bg-[#7F0000] rounded-xl p-5 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Top Selling Category</h3>
            <p className="text-sm opacity-90">{topItem.name}</p>
          </div>
          <div className="text-4xl font-bold">
            {totalSales > 0
              ? `${Math.round((topItem.sales / totalSales) * 100)}%`
              : "0%"}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSalesDistribution;
