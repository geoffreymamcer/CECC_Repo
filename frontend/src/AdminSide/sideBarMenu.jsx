import React from "react";
import "./AdminSide.css";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: "patient", label: "Patient" },
    {
      id: "patient-analytics",
      label: (
        <>
          Patient
          <br />
          Analytics
        </>
      ),
    },
    {
      id: "sales-analytics",
      label: (
        <>
          Sales
          <br />
          Analytics
        </>
      ),
    },
    { id: "appointments", label: "Appointments" },
    { id: "inventory", label: "Inventory" },
    { id: "Color Vision Test", label: "Color Vision Test" },
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => setActiveItem(item.id)}
          >
            <span className="menu-item-text">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
