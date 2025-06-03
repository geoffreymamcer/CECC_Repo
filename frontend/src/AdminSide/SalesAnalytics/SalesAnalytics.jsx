import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// Color palette
const colors = {
  maroon: "#800000",
  lightMaroon: "#a04040",
  white: "#ffffff",
  lightGray: "#f5f5f5",
  text: "#333333",
};

// Sample sales data - replace with backend API calls
const productSalesData = [
  { name: "Eyeglasses", value: 45 },
  { name: "Contact Lenses", value: 30 },
  { name: "Sunglasses", value: 15 },
  { name: "Eye Drops", value: 7 },
  { name: "Accessories", value: 3 },
];

const salesTrendData = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 14300 },
  { month: "Mar", revenue: 16200 },
  { month: "Apr", revenue: 18500 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 23800 },
];

const salesByCategoryData = [
  { category: "Prescription", sales: 32000 },
  { category: "Non-Prescription", sales: 18000 },
  { category: "Insurance", sales: 42000 },
  { category: "Self-Pay", sales: 9000 },
];

const topProductsData = [
  { product: "Progressive Lenses", sales: 12500 },
  { product: "Daily Contacts", sales: 9800 },
  { product: "Anti-Glare Coating", sales: 8700 },
  { product: "Blue Light Glasses", sales: 7600 },
  { product: "Multifocal Contacts", sales: 6500 },
];

// Reuse the same GraphDropdown component from patient analytics
const GraphDropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.dropdownContainer}>
      <div style={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        {selected}
        <span style={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div style={styles.dropdownList}>
          {options.map((option, index) => (
            <div
              key={index}
              style={styles.dropdownItem}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Sales Dashboard Component
const SalesAnalyticsDashboard = () => {
  const [selectedGraph, setSelectedGraph] = useState(
    "Product Sales Distribution"
  );

  const graphOptions = [
    "Product Sales Distribution",
    "Sales Trend Over Time",
    "Sales by Payment Category",
    "Top Performing Products",
  ];

  const renderSelectedGraph = () => {
    switch (selectedGraph) {
      case "Product Sales Distribution":
        return <ProductSalesChart />;
      case "Sales Trend Over Time":
        return <SalesTrendChart />;
      case "Sales by Payment Category":
        return <SalesCategoryChart />;
      case "Top Performing Products":
        return <TopProductsChart />;
      default:
        return <ProductSalesChart />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.dashboardTitle}>Sales Analytics</h1>

      <div style={styles.dropdownWrapper}>
        <GraphDropdown
          options={graphOptions}
          selected={selectedGraph}
          onChange={setSelectedGraph}
        />
      </div>

      <div style={styles.graphContainer}>{renderSelectedGraph()}</div>

      <div style={styles.graphGrid}>
        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Product Sales Distribution</h3>
          <ProductSalesChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Sales Trend Over Time</h3>
          <SalesTrendChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Sales by Payment Category</h3>
          <SalesCategoryChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Top Performing Products</h3>
          <TopProductsChart />
        </div>
      </div>
    </div>
  );
};

// Individual Chart Components
const ProductSalesChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={productSalesData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill={colors.maroon}
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {productSalesData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getShade(index, productSalesData.length)}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SalesTrendChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={salesTrendData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.lightMaroon} />
        <XAxis dataKey="month" stroke={colors.maroon} />
        <YAxis
          stroke={colors.maroon}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={colors.maroon}
          strokeWidth={3}
          activeDot={{ r: 8 }}
          name="Monthly Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const SalesCategoryChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={salesByCategoryData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.lightMaroon} />
        <XAxis dataKey="category" stroke={colors.maroon} />
        <YAxis
          stroke={colors.maroon}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
        />
        <Legend />
        <Bar
          dataKey="sales"
          fill={colors.maroon}
          name="Total Sales"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const TopProductsChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={topProductsData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.lightMaroon} />
        <XAxis
          type="number"
          stroke={colors.maroon}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis
          dataKey="product"
          type="category"
          stroke={colors.maroon}
          width={90}
        />
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
        />
        <Legend />
        <Bar
          dataKey="sales"
          fill={colors.maroon}
          name="Product Sales"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Reuse helper functions from patient analytics
const getShade = (index, total) => {
  const baseColor = colors.maroon;
  const baseR = parseInt(baseColor.slice(1, 3), 16);
  const baseG = parseInt(baseColor.slice(3, 5), 16);
  const baseB = parseInt(baseColor.slice(5, 7), 16);

  const factor = 0.8 - (index / total) * 0.6;
  const r = Math.min(255, Math.floor(baseR + (255 - baseR) * factor));
  const g = Math.min(255, Math.floor(baseG + (255 - baseG) * factor));
  const b = Math.min(255, Math.floor(baseB + (255 - baseB) * factor));

  return `rgb(${r}, ${g}, ${b})`;
};

// Reuse styles from patient analytics
const styles = {
  dashboardContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: colors.white,
    color: colors.text,
    maxWidth: "1200px",
    margin: "0 auto",
  },
  dashboardTitle: {
    color: colors.maroon,
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
  },
  dropdownWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  dropdownContainer: {
    position: "relative",
    width: "300px",
  },
  dropdownHeader: {
    padding: "12px 15px",
    backgroundColor: colors.maroon,
    color: colors.white,
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  dropdownArrow: {
    fontSize: "12px",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightMaroon}`,
    borderRadius: "0 0 5px 5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    zIndex: "100",
  },
  dropdownItem: {
    padding: "12px 15px",
    cursor: "pointer",
    borderBottom: `1px solid ${colors.lightGray}`,
    transition: "background-color 0.2s",
  },
  graphContainer: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${colors.lightGray}`,
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  graphGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  graphCard: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${colors.lightGray}`,
    height: "450px",
  },
  graphTitle: {
    color: colors.maroon,
    marginTop: "0",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
  },
};

export default SalesAnalyticsDashboard;
