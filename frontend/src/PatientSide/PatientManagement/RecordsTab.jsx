import React from "react";
import {
  FiCalendar,
  FiEye,
  FiFileText,
  FiShoppingBag,
  FiCheckCircle,
} from "react-icons/fi";
import "./PatientManagement.css";

const RecordsTabs = ({ activeTab, setActiveTab, selectedVisit, visits }) => {
  return (
    <div className="records-tabs">
      <button
        className={activeTab === "visitHistory" ? "active" : ""}
        onClick={() => setActiveTab("visitHistory")}
      >
        <FiCalendar /> Visits
      </button>
      <button
        className={activeTab === "medicalRecord" ? "active" : ""}
        onClick={() => setActiveTab("medicalRecord")}
        disabled={!visits[selectedVisit]}
      >
        <FiEye /> Record
      </button>
      <button
        className={activeTab === "prescriptions" ? "active" : ""}
        onClick={() => setActiveTab("prescriptions")}
        disabled={!visits[selectedVisit]?.prescription}
      >
        <FiFileText /> Rx
      </button>
      <button
        className={activeTab === "transactions" ? "active" : ""}
        onClick={() => setActiveTab("transactions")}
        disabled={!visits[selectedVisit]?.products?.length}
      >
        <FiShoppingBag /> Receipt
      </button>
      <button
        className={activeTab === "colorVision" ? "active" : ""}
        onClick={() => setActiveTab("colorVision")}
        disabled={!visits[selectedVisit]?.colorVisionTest}
      >
        <FiCheckCircle /> Color Vision
      </button>
    </div>
  );
};

export default RecordsTabs;
