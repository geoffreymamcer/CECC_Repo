import React from "react";

const ClinicalCorrelationChart = ({ data }) => {
  // data = [{ condition: "Myopia", Child: 5, Teen: 10, ... }, ...]
  const ageGroups = ["Child", "Teen", "Young Adult", "Adult", "Senior"];

  // Calculate max value for opacity scaling
  const maxValue = Math.max(
    ...data.flatMap((row) => ageGroups.map((age) => row[age] || 0))
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Clinical Correlation Matrix
        </h3>
        <p className="text-sm text-gray-500">
          Diagnosis frequency across different age groups.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="font-bold text-gray-400 text-xs uppercase tracking-wider flex items-end pb-2">
              Diagnosis
            </div>
            {ageGroups.map((age) => (
              <div
                key={age}
                className="font-bold text-center text-gray-600 text-xs uppercase tracking-wider bg-gray-50 rounded-lg py-2"
              >
                {age}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          <div className="space-y-2">
            {data.map((row) => (
              <div key={row.condition} className="grid grid-cols-6 gap-2 group">
                {/* Y-Axis Label */}
                <div className="font-medium text-gray-700 text-sm flex items-center pl-2 border-l-4 border-transparent group-hover:border-deep-red transition-all">
                  {row.condition}
                </div>

                {/* Heatmap Cells */}
                {ageGroups.map((age) => {
                  const value = row[age] || 0;
                  const intensity = maxValue > 0 ? value / maxValue : 0;
                  
                  return (
                    <div
                      key={age}
                      className="relative h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default group/cell"
                      style={{
                        backgroundColor: `rgba(220, 38, 38, ${Math.max(
                          0.05,
                          intensity
                        )})`, // deep-red base
                        color: intensity > 0.6 ? "white" : "#7f1d1d",
                      }}
                    >
                      <span className="font-bold text-sm">{value}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 w-32 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-opacity shadow-xl">
                        <div className="font-bold mb-1">{row.condition}</div>
                        <div>{age}: {value} patients</div>
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center gap-4 text-xs text-gray-500 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600 opacity-10"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600 opacity-50"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600"></div>
          <span>High Frequency</span>
        </div>
      </div>
    </div>
  );
};

export default ClinicalCorrelationChart;
