import React, { useState } from "react";
import {
  FaFileInvoice,
  FaEye,
  FaDownload,
  FaStethoscope,
  FaBoxOpen,
} from "react-icons/fa";

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-deep-red"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const InvoiceTab = ({
  invoices,
  isLoadingInvoices,
  handleViewPDF,
  handleDownloadPDF,
  setShowInvoiceModal,
  pdfLoadingState,
  setShowServiceInvoiceModal,
}) => {
  const [showTypeSelection, setShowTypeSelection] = useState(false);

  const handleCreateClick = () => {
    setShowTypeSelection(true);
  };

  const handleSelectType = (type) => {
    setShowTypeSelection(false);
    if (type === "product") {
      setShowInvoiceModal(true);
    } else {
      setShowServiceInvoiceModal(true);
    }
  };
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );
  const amountPaid = totalInvoiced;
  const outstandingBalance = totalInvoiced - amountPaid;

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800 flex items-center">
          <FaFileInvoice className="mr-2 text-deep-red" />
          Invoice Details
        </h4>
        <button
          onClick={handleCreateClick}
          className="px-3 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all text-sm"
        >
          + Create Invoice
        </button>
      </div>

      {showTypeSelection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Select Invoice Type
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSelectType("product")}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-deep-red hover:bg-red-50 transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-deep-red transition-colors">
                  <FaBoxOpen className="text-deep-red group-hover:text-white text-xl" />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-deep-red">
                  Product Invoice
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  Frames, Lenses, Items
                </span>
              </button>

              <button
                onClick={() => handleSelectType("service")}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                  <FaStethoscope className="text-blue-600 group-hover:text-white text-xl" />
                </div>
                <span className="font-bold text-gray-700 group-hover:text-blue-600">
                  Service Invoice
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  Checkups, Consultations
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowTypeSelection(false)}
              className="w-full mt-6 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg col-span-1 md:col-span-2">
            <h5 className="font-bold text-gray-800 mb-3">Recent Invoices</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Invoice #</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Services</th>
                    <th className="text-right py-2 px-2">Amount</th>
                    <th className="text-center py-2 px-2">Status</th>
                    <th className="text-right py-2 px-2">Printables</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingInvoices ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center">
                        No invoices found for this patient.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice._id} className="border-b">
                        <td className="py-2 px-2">{invoice.invoiceNumber}</td>
                        <td className="py-2 px-2">
                          {invoice.invoiceDate
                            ? new Date(invoice.invoiceDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-2 px-2">
                          {(invoice.items || [])
                            .map((item) => item.itemName)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="text-right py-2 px-2">
                          ₱{(invoice.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="text-center py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}
                          >
                            Paid
                          </span>
                        </td>
                        <td className="text-right py-2 px-2">
                          <button
                            onClick={() => handleViewPDF(invoice._id)}
                            className="text-deep-red hover:text-dark-red mr-2"
                            title="View PDF"
                            disabled={
                              pdfLoadingState.view === invoice._id ||
                              pdfLoadingState.download === invoice._id
                            }
                          >
                            {pdfLoadingState.view === invoice._id ? (
                              <Spinner />
                            ) : (
                              <FaEye />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadPDF(
                                invoice._id,
                                invoice.invoiceNumber
                              )
                            }
                            className="text-deep-red hover:text-dark-red"
                            title="Download PDF"
                            disabled={
                              pdfLoadingState.view === invoice._id ||
                              pdfLoadingState.download === invoice._id
                            }
                          >
                            {pdfLoadingState.download === invoice._id ? (
                              <Spinner />
                            ) : (
                              <FaDownload />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-gray-800 mb-3">Payment Summary</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Invoiced</span>
                <span className="font-bold">₱{totalInvoiced.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Amount</span>
                <span className="font-bold text-green-600">
                  ₱{amountPaid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Outstanding Balance</span>
                <span className="font-bold text-deep-red">
                  ₱{outstandingBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTab;
