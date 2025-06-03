import React from "react";
import { FiDownload } from "react-icons/fi";
import "./PatientManagement.css";

const Prescriptions = ({ visit, handleDownloadPDF }) => {
  return (
    <div className="prescription-record">
      <div className="section-header">
        <h3>Prescription</h3>
        <button
          className="download-btn"
          onClick={() => handleDownloadPDF("prescription")}
        >
          <FiDownload /> PDF
        </button>
      </div>

      <div className="prescription-details">
        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span>{new Date(visit.date).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Provider:</span>
          <span>{visit.doctor}</span>
        </div>

        <div className="prescription-grid">
          <div className="grid-header">Eye</div>
          <div className="grid-header">Sphere (SPH)</div>
          <div className="grid-header">Cylinder (CYL)</div>
          <div className="grid-header">Axis</div>

          <div>Right (OD)</div>
          <div>{visit.prescription.rightEye || "Plano"}</div>
          <div>{visit.prescription.rightCyl || "-"}</div>
          <div>{visit.prescription.rightAxis || "-"}</div>

          <div>Left (OS)</div>
          <div>{visit.prescription.leftEye || "Plano"}</div>
          <div>{visit.prescription.leftCyl || "-"}</div>
          <div>{visit.prescription.leftAxis || "-"}</div>
        </div>

        {visit.prescription.pd && (
          <div className="detail-row">
            <span className="detail-label">Pupillary Distance (PD):</span>
            <span>{visit.prescription.pd}</span>
          </div>
        )}

        {visit.prescription.notes && (
          <div className="prescription-notes">
            <h4>Notes</h4>
            <p>{visit.prescription.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
