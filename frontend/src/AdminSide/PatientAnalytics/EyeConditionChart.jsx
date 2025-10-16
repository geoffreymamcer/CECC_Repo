import React from "react";
import { FaChartPie } from "react-icons/fa";
import { Pie } from "react-chartjs-2";

const EyeConditionChart = ({ eyeConditions, calculateTotal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChartPie className="mr-2 text-deep-red" />
          Eye Condition Distribution
        </h2>
        <div className="text-sm text-gray-500">
          Total: {calculateTotal(eyeConditions)} patients
        </div>
      </div>

      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-48 h-48">
            <Pie
              data={{
                labels: eyeConditions.map((condition) => condition.name),
                datasets: [
                  {
                    data: eyeConditions.map((condition) => condition.value),
                    backgroundColor: eyeConditions.map(
                      (condition) => condition.color
                    ),
                    borderColor: "white",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <div className="space-y-4">
            {eyeConditions.map((condition, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: condition.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{condition.name}</span>
                    <span className="font-bold">
                      {condition.value} (
                      {Math.round(
                        (condition.value / calculateTotal(eyeConditions)) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          (condition.value / calculateTotal(eyeConditions)) *
                          100
                        }%`,
                        backgroundColor: condition.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeConditionChart;
