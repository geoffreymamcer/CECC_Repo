import React, { useState } from "react";
import PatientCard from "./PatientPortalCard";
import RecordsTabs from "./RecordsTab";
import VisitHistory from "./VisitHistory";
import MedicalRecord from "./MedicalRecord";
import Prescriptions from "./PrescriptionRecord";
import Transactions from "./TransactionRecord";
import ColorVisionTest from "./ColorVisiontestRecord";
import "./PatientManagement.css";

const EyeCareRecordsViewer = () => {
  const [activeTab, setActiveTab] = useState("visitHistory");
  const [selectedVisit, setSelectedVisit] = useState(0);

  // Mock data
  const patient = {
    name: "Sarah Johnson",
    id: "EC-2023-0456",
    dob: "1985-06-15",
    lastVisit: "2023-05-10",
  };

  const visits = [
    {
      date: "2023-05-10",
      doctor: "Dr. Robert Chen",
      reason: "Annual checkup",
      diagnosis: "Mild myopia (-1.25 both eyes)",
      treatment: "Prescription glasses recommended. Follow-up in 1 year.",
      prescription: {
        rightEye: "-1.25 sph",
        leftEye: "-1.25 sph",
        pd: "62mm",
        notes: "Anti-reflective coating recommended",
      },
      products: [
        { name: "Eyeglass Frame - Model A", price: 120 },
        { name: "Anti-Reflective Coating", price: 45 },
        { name: "Lens Upgrade - Thin & Light", price: 80 },
      ],
      colorVisionTest: {
        testType: "Ishihara Plate Test (Remote)",
        date: "2023-05-08",
        result: "Mild red-green deficiency detected",
        platesShown: 14,
        platesCorrect: 10,
        notes: "Patient had difficulty with plates 3, 7, 12, and 13",
        followUpTests: [
          "Farnsworth D-15 test",
          "Anomaloscope examination",
          "HRR Pseudoisochromatic Plates",
          "Occupational vision assessment",
        ],
      },
    },
    {
      date: "2022-05-15",
      doctor: "Dr. Emily Rodriguez",
      reason: "Eye strain complaints",
      diagnosis: "Computer vision syndrome",
      treatment: "20-20-20 rule education. Artificial tears recommended.",
      prescription: null,
      products: [{ name: "Artificial Tears (30ml)", price: 15 }],
      colorVisionTest: null,
    },
  ];

  const handleDownloadPDF = (contentType) => {
    alert(`Downloading ${contentType} as PDF...`);
  };

  return (
    <div className="eyecare-records-viewer">
      <header className="eyecare-records-viewer__header">
        <h1>Candelaria Eye Care Clinic</h1>
      </header>

      <PatientCard patient={patient} />

      <RecordsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedVisit={selectedVisit}
        visits={visits}
      />

      <div className="records-content">
        {activeTab === "visitHistory" && (
          <VisitHistory
            visits={visits}
            selectedVisit={selectedVisit}
            setSelectedVisit={setSelectedVisit}
          />
        )}

        {activeTab === "medicalRecord" && visits[selectedVisit] && (
          <MedicalRecord
            visit={visits[selectedVisit]}
            handleDownloadPDF={handleDownloadPDF}
          />
        )}

        {activeTab === "prescriptions" &&
          visits[selectedVisit]?.prescription && (
            <Prescriptions
              visit={visits[selectedVisit]}
              handleDownloadPDF={handleDownloadPDF}
            />
          )}

        {activeTab === "transactions" &&
          visits[selectedVisit]?.products?.length > 0 && (
            <Transactions
              visit={visits[selectedVisit]}
              handleDownloadPDF={handleDownloadPDF}
            />
          )}

        {activeTab === "colorVision" &&
          visits[selectedVisit]?.colorVisionTest && (
            <ColorVisionTest
              visit={visits[selectedVisit]}
              handleDownloadPDF={handleDownloadPDF}
            />
          )}
      </div>
    </div>
  );
};

export default EyeCareRecordsViewer;
