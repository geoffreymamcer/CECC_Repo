import React from "react";
import { FiDownload } from "react-icons/fi";
import "./PatientManagement.css";

const Transactions = ({ visit, handleDownloadPDF }) => {
  return (
    <div className="transaction-record">
      <div className="section-header">
        <h3>Receipt</h3>
        <button
          className="download-btn"
          onClick={() => handleDownloadPDF("receipt")}
        >
          <FiDownload /> PDF
        </button>
      </div>

      <div className="receipt-details">
        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span>{new Date(visit.date).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Provider:</span>
          <span>{visit.doctor}</span>
        </div>

        <div className="receipt-items">
          <div className="receipt-header">
            <span>Item</span>
            <span>Price</span>
          </div>

          {visit.products.map((item, index) => (
            <div key={index} className="receipt-item">
              <span>{item.name}</span>
              <span>P{item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="receipt-total">
            <span>Total:</span>
            <span>
              P
              {visit.products
                .reduce((sum, item) => sum + item.price, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
