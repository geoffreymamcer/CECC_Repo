import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./invoicePrint.css";
import cecc_logo from "../AdminSideAssets/CECC-Logo.png";

export default function InvoiceModal({ isOpen, onClose }) {
  const contentRef = useRef();

  const handleDownloadPDF = async () => {
    try {
      const element = contentRef.current;
      if (!element) return;

      // Store original styles
      const originalStyle = element.style.cssText;

      // Temporarily modify styles for better capture
      element.style.maxHeight = "none";
      element.style.height = "auto";
      element.style.overflow = "visible";

      // Calculate proper dimensions
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Create canvas with proper scaling
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        logging: false,
      });

      // Calculate dimensions
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add pages as needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      // First page
      pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight, "", "FAST");
      heightLeft -= pdfHeight;

      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = -pdfHeight * pageNumber;
        pdf.addPage();
        pdf.addImage(
          canvas,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        heightLeft -= pdfHeight;
        pageNumber++;
      }

      // Save PDF
      pdf.save(`invoice-${Date.now()}.pdf`);

      // Restore original styles
      element.style.cssText = originalStyle;
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isOpen) return null;

  const invoiceData = {
    date: "Wednesday, July 13, 2022",
    invoiceNo: "356",
    patientId: "Px328",
    patientName: "Sonny Ontoy Reyes",
    address: "PAHINGA NORTE, CANDELARIA",
    telephone: "0960-525-0740",
    items: [
      {
        description: "Parim P7 919 S1",
        qty: 1,
        unitPrice: 3000,
        discount: 0,
        total: 3000,
      },
      {
        description: "Sv Rx 1.59 Transitions Clarity Green",
        qty: 2,
        unitPrice: 8850,
        discount: 700,
        total: 17000,
      },
      {
        description: "Sancoba Free",
        qty: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ],
    subtotal: 20000,
    amountPaid: 20000,
    totalDue: 0,
    jobOrderNo: "JO 376",
    lab: "PLASTILENS",
    note: "RUSH",
    sperical: { R: -5.75, L: -3.0 },
    cyl: { R: -3.0, L: -2.75 },
    axis: { R: 180, L: 180 },
  };

  const PatientCopy = () => (
    <div className="watermark-container border border-gray-300 p-6 rounded-lg shadow-md bg-white print:shadow-none print:border-black print:rounded-none">
      <img
        src={cecc_logo}
        alt="Watermark"
        className="watermark"
        style={{
          objectFit: "contain",
          maxWidth: "300px",
          filter: "contrast(0.8) brightness(1.2)",
        }}
      />{" "}
      <div className="content">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-3">
          <div>
            <p className="text-xs text-gray-600 leading-tight">
              Candelaria Eye Care Clinic
              <br />
              2nd Flr. APC Bldg, CKDC Optical Center, Matalim Hi-way
              <br />
              Brgy. Malusak 4323 Candelaria, Quezon, Philippines
              <br />
              Contact no. 0915 916 7671
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Patient Copy
            </h2>
            <p className="text-sm">
              <strong className="font-semibold">Clinic Schedule:</strong>
              <br />
              MON - SAT 9AM to 6PM
            </p>
          </div>
        </div>
        {/* Patient & Invoice Info */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <p className="flex justify-between">
            <strong>Date:</strong> <span>{invoiceData.date}</span>
          </p>
          <p className="flex justify-between">
            <strong>Invoice No.:</strong> <span>{invoiceData.invoiceNo}</span>
          </p>
          <p className="flex justify-between">
            <strong>Patient I.D.:</strong> <span>{invoiceData.patientId}</span>
          </p>
          <p className="flex justify-between">
            <strong>Patient Name:</strong>{" "}
            <span>{invoiceData.patientName}</span>
          </p>
          <p className="flex justify-between">
            <strong>Address:</strong> <span>{invoiceData.address}</span>
          </p>
          <p className="flex justify-between">
            <strong>Telephone:</strong> <span>{invoiceData.telephone}</span>
          </p>
        </div>

        {/* Table */}
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100 print:bg-white">
            <tr>
              <th className="border px-2 py-1 text-left">Item Description</th>
              <th className="border px-2 py-1">Qty.</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Discount</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"
                }
              >
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1 text-center">{item.qty}</td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.unitPrice.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.discount.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end text-sm mb-4 font-medium">
          <div className="w-1/2">
            <p className="flex justify-between">
              <strong>Subtotal P:</strong>{" "}
              <span>{invoiceData.subtotal.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <strong>Amount Paid P:</strong>{" "}
              <span>{invoiceData.amountPaid.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <strong>Total Amount Due P:</strong>{" "}
              <span>{invoiceData.totalDue.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Signature / Lab Info */}
        <div className="text-sm mt-4 grid grid-cols-2">
          <div>
            <p className="flex justify-between">
              <strong>Delivery Date:</strong> <span>___________________</span>
            </p>
            <p className="flex justify-between">
              <strong>Created by:</strong> <span>DocPhilip</span>
            </p>
          </div>
          <div>
            <p className="flex justify-between">
              <strong>Conforme:</strong> <span>___________________</span>
            </p>
            <p className="flex justify-between">
              <strong>Date:</strong> <span>___________________</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ClinicCopy = () => (
    <div className="watermark-container border border-gray-300 p-6 rounded-lg shadow-md bg-white print:shadow-none print:border-black print:rounded-none">
      <img
        src={cecc_logo}
        alt="Watermark"
        className="watermark"
        style={{
          objectFit: "contain",
          maxWidth: "300px",
          filter: "contrast(0.8) brightness(1.2)",
        }}
      />{" "}
      <div className="content">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-3">
          <div>
            <p className="text-xs text-gray-600 leading-tight">
              Candelaria Eye Care Clinic
              <br />
              2nd Flr. APC Bldg, CKDC Optical Center, Matalim Hi-way
              <br />
              Brgy. Malusak 4323 Candelaria, Quezon, Philippines
              <br />
              Contact no. 0915 916 7671
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Clinic Copy
            </h2>
          </div>
        </div>

        {/* Patient & Invoice Info */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <p className="flex justify-between">
            <strong>Date:</strong> <span>Wed, Jul 13, 2022</span>
          </p>
          <p className="flex justify-between">
            <strong>Patient I.D.:</strong> <span>{invoiceData.patientId}</span>
          </p>
          <p className="flex justify-between">
            <strong>Patient Name:</strong>{" "}
            <span>{invoiceData.patientName}</span>
          </p>
          <p className="flex justify-between">
            <strong>Address:</strong> <span>{invoiceData.address}</span>
          </p>
          <p className="flex justify-between">
            <strong>Telephone:</strong> <span>{invoiceData.telephone}</span>
          </p>
        </div>

        {/* Prescription Table */}
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100 print:bg-white">
            <tr>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1">Sph</th>
              <th className="border px-2 py-1">Cyl</th>
              <th className="border px-2 py-1">Axis</th>
              <th className="border px-2 py-1">Add</th>
              <th className="border px-2 py-1">PD</th>
              <th className="border px-2 py-1">Mono PD</th>
              <th className="border px-2 py-1">SH</th>
              <th className="border px-2 py-1">BC</th>
              <th className="border px-2 py-1">Dia</th>
              <th className="border px-2 py-1">Tint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-semibold">R</td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.sperical.R}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.cyl.R}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.axis.R}
              </td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">L</td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.sperical.L}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.cyl.L}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.axis.L}
              </td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
            </tr>
          </tbody>
        </table>

        {/* Table */}
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100 print:bg-white">
            <tr>
              <th className="border px-2 py-1 text-left">Item Description</th>
              <th className="border px-2 py-1">Qty.</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Discount</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"
                }
              >
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1 text-center">{item.qty}</td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.unitPrice.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.discount.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end text-sm mb-4 font-medium">
          <div className="w-1/2">
            <p className="flex justify-between">
              <strong>Subtotal P:</strong>{" "}
              <span>{invoiceData.subtotal.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <strong>Amount Paid P:</strong>{" "}
              <span>{invoiceData.amountPaid.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <strong>Total Amount Due P:</strong>{" "}
              <span>{invoiceData.totalDue.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Signature / Lab Info */}
        <div className="text-sm mt-4 grid grid-cols-2">
          <div>
            <p className="flex justify-between">
              <strong>Delivery Date:</strong> <span>___________________</span>
            </p>
            <p className="flex justify-between">
              <strong>Created by:</strong> <span>DocPhilip</span>
            </p>
          </div>
          <div>
            <p className="flex justify-between">
              <strong>Conforme:</strong> <span>___________________</span>
            </p>
            <p className="flex justify-between">
              <strong>Date:</strong> <span>___________________</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const LaboratoryCopy = () => (
    <div className="watermark-container border border-gray-300 p-6 rounded-lg shadow-md bg-white print:shadow-none print:border-black print:rounded-none">
      <img
        src={cecc_logo}
        alt="Watermark"
        className="watermark"
        style={{
          objectFit: "contain",
          maxWidth: "300px",
          filter: "contrast(0.8) brightness(1.2)",
        }}
      />{" "}
      <div className="content">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-3">
          <div>
            <p className="text-xs text-gray-600 leading-tight">
              Candelaria Eye Care Clinic
              <br />
              2nd Flr. APC Bldg, CKDC Optical Center, Matalim Hi-way
              <br />
              Brgy. Malusak 4323 Candelaria, Quezon, Philippines
              <br />
              Contact no. 0915 916 7671
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Laboratory Copy
            </h2>
          </div>
        </div>
        {/* Patient & Invoice Info */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <p className="flex justify-between">
            <strong>Patient I.D.:</strong> <span>{invoiceData.patientId}</span>
          </p>
          <p className="flex justify-between">
            <strong>Patient Name:</strong>{" "}
            <span>{invoiceData.patientName}</span>
          </p>
          <p className="flex justify-between">
            <strong>Address:</strong> <span>{invoiceData.address}</span>
          </p>
          <p className="flex justify-between">
            <strong>Telephone:</strong> <span>{invoiceData.telephone}</span>
          </p>
        </div>

        {/* Prescription Table */}
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100 print:bg-white">
            <tr>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1">Sph</th>
              <th className="border px-2 py-1">Cyl</th>
              <th className="border px-2 py-1">Axis</th>
              <th className="border px-2 py-1">Add</th>
              <th className="border px-2 py-1">PD</th>
              <th className="border px-2 py-1">Mono PD</th>
              <th className="border px-2 py-1">SH</th>
              <th className="border px-2 py-1">BC</th>
              <th className="border px-2 py-1">Dia</th>
              <th className="border px-2 py-1">Tint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-semibold">R</td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.sperical.R}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.cyl.R}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.axis.R}
              </td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border px-2 py-1 font-semibold">L</td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.sperical.L}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.cyl.L}
              </td>
              <td className="border px-2 py-1 text-center">
                {invoiceData.axis.L}
              </td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
              <td className="border px-2 py-1"></td>
            </tr>
          </tbody>
        </table>

        {/* Table */}
        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-100 print:bg-white">
            <tr>
              <th className="border px-2 py-1 text-left">Item Description</th>
              <th className="border px-2 py-1">Qty.</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Discount</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50 print:bg-white"
                }
              >
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1 text-center">{item.qty}</td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.unitPrice.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.discount.toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-right">
                  ₱ {item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative font-serif print:shadow-none print:rounded-none print:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Download button OUTSIDE ref so it's not included in PDF */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        {/* Actual content to be captured */}
        <div ref={contentRef}>
          <PatientCopy />
          <ClinicCopy />
          <LaboratoryCopy />
        </div>
      </div>
    </div>
  );
}
