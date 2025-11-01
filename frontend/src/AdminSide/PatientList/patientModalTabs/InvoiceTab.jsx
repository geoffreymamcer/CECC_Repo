import React from "react";
import { FaFileInvoice, FaEye, FaDownload } from "react-icons/fa";

const InvoiceTab = ({
  invoices,
  isLoadingInvoices,
  handleViewPDF,
  handleDownloadPDF,
  setShowInvoiceModal,
}) => {
  // Calculate payment summaries
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + (inv.subtotal || 0),
    0
  );
  const amountPaid = invoices.reduce(
    (sum, inv) => sum + (inv.amountPaid || 0),
    0
  );
  const outstandingBalance = invoices.reduce(
    (sum, inv) => sum + ((inv.totalDue || 0) - (inv.amountPaid || 0)),
    0
  );

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800 flex items-center">
          <FaFileInvoice className="mr-2 text-deep-red" />
          Invoice Details
        </h4>
        <button
          onClick={() => setShowInvoiceModal(true)}
          className="px-3 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all text-sm"
        >
          + Create Invoice
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Invoices Table */}
          <div className="bg-white p-4 rounded-lg col-span-2">
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
                            .map((item) => item.description)
                            .filter(Boolean)
                            .join(", ") || "N/A"}
                        </td>
                        <td className="text-right py-2 px-2">
                          ₱{(invoice.totalDue || 0).toFixed(2)}
                        </td>
                        <td className="text-center py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "partially_paid"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoice.status === "paid"
                              ? "Paid"
                              : invoice.status === "partially_paid"
                              ? "Partially Paid"
                              : "Unpaid"}
                          </span>
                        </td>
                        <td className="text-right py-2 px-2">
                          <button
                            onClick={() => handleViewPDF(invoice._id)}
                            className="text-deep-red hover:text-dark-red mr-2"
                            title="View PDF"
                          >
                            <FaEye />
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
                          >
                            <FaDownload />
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

          {/* Payment History */}
          <div className="bg-white p-4 rounded-lg">
            <h5 className="font-bold text-gray-800 mb-3">Payment History</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {invoices.filter((inv) => (inv.amountPaid || 0) > 0).length >
              0 ? (
                invoices
                  .filter((inv) => inv.amountPaid > 0)
                  .map((invoice) => (
                    <div key={invoice._id} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>
                          {invoice.updatedAt
                            ? new Date(invoice.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span className="text-green-600">
                          ₱{(invoice.amountPaid || 0).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Payment for Invoice #{invoice.invoiceNumber || "N/A"}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-2">
                  No payment history available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTab;
