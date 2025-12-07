// backend/services/serviceInvoiceTemplate.js

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "0.00";
  return Number(amount).toFixed(2);
}

// Generates HTML for a specific copy (Patient or Clinic)
function generateServiceCopyHtml(type, invoice, logoBase64) {
  // Generate Service Rows
  let itemRows = "";
  // Display all items (services usually list fewer items than products, but we allow expansion)
  // Default to minimum 4 rows to keep layout stable
  const minRows = 4;
  const totalRows = Math.max(invoice.items.length, minRows);

  for (let i = 0; i < totalRows; i++) {
    const item = invoice.items[i] || {};
    itemRows += `
            <tr>
                <td style="text-align: left; padding-left: 10px;">${
                  item.itemName || ""
                }</td>
                <td>${item.qty || ""}</td>
                <td>${item.unitPrice ? formatCurrency(item.unitPrice) : ""}</td>
                <td>${item.discount ? formatCurrency(item.discount) : ""}</td>
                <td>${item.price ? formatCurrency(item.price) : ""}</td>
            </tr>
        `;
  }

  return `
        <div class="copy-container">
            <div class="header">
                <div class="header-left">
                  <img src="${logoBase64}" class="logo" />
                </div>
                <div class="header-center">
                    <h2>Candelaria Eye Care Clinic</h2>
                    <p>2nd Flr. APC Bldg., CKCI Dialysis Center, Maharlika Highway, Brgy. Masin Sur 4223, Candelaria, Quezon, Philippines</p>
                    <p>Contact No: 0915 506 7571</p>
                </div>
                <div class="header-right">
                    <p>Clinic Schedule:</p>
                    <p>Mon - Sat 9AM - 6PM</p>
                </div>
            </div>

            <div class="title-bar">
                <h3>SERVICE INVOICE - ${type}</h3>
            </div>
            
            <div class="details-grid">
                <div class="details-col">
                    <div class="detail-item"><strong>Date:</strong><span class="line-input">${formatDate(
                      invoice.invoiceDate
                    )}</span></div>
                    <div class="detail-item"><strong>Time:</strong><span class="line-input">${formatTime(
                      invoice.invoiceDate
                    )}</span></div>
                    <div class="detail-item"><strong>Invoice No:</strong><span class="line-input">${
                      invoice.invoiceNumber
                    }</span></div>
                </div>
                <div class="details-col">
                    <div class="detail-item"><strong>Patient Name:</strong><span class="line-input">${
                      invoice.patientName
                    }</span></div>
                    <div class="detail-item"><strong>Address:</strong><span class="line-input">${
                      invoice.patientAddress
                    }</span></div>
                    <div class="detail-item"><strong>Created By:</strong><span class="line-input">${
                      invoice.creatorName || invoice.createdBy
                    }</span></div>
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 40%;">Service Description</th>
                        <th style="width: 10%;">Qty</th>
                        <th style="width: 15%;">Fee</th>
                        <th style="width: 15%;">Discount</th>
                        <th style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
            </table>

            <div class="footer-grid">
                <div class="footer-col left">
                    <div><strong>Notes:</strong></div>
                    <div style="font-size: 8pt; margin-top: 2px;">${
                      invoice.notes || "None"
                    }</div>
                </div>
                <div class="footer-col right">
                    <div class="total-row"><span>Subtotal</span><span>${formatCurrency(
                      invoice.totalAmount
                    )}</span></div>
                    <div class="total-row"><span>Amount Paid</span><span>${formatCurrency(
                      invoice.amountPaid || 0
                    )}</span></div>
                    <div class="total-row total-due"><strong>Total Amount Due</strong><strong>${formatCurrency(
                      (invoice.totalAmount || 0) - (invoice.amountPaid || 0)
                    )}</strong></div>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 8pt;">
                <div style="text-align: center;">
                    <div style="border-top: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
                    <strong>Patient Signature</strong>
                </div>
                <div style="text-align: center;">
                    <div style="border-top: 1px solid #333; width: 200px; margin-bottom: 5px;"></div>
                    <strong>Authorized Signature</strong>
                </div>
            </div>
        </div>
    `;
}

export function getServiceInvoiceHtml(invoice, logoBase64) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Service Invoice - ${invoice.invoiceNumber}</title>
            <style>
                :root { --deep-red: #7F0000; --dark-red: #8B0000; }
                html { -webkit-print-color-adjust: exact; }
                body { font-family: Arial, sans-serif; font-size: 9pt; color: #333; margin: 0; }
                .page { padding: 0; }

                .copy-container { 
                    padding-bottom: 10mm; 
                    margin-bottom: 10mm;
                    border-bottom: 2px dashed #ccc; 
                    page-break-inside: avoid;
                }
                .copy-container:last-child { border-bottom: none; margin-bottom: 0; }
                
                .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid var(--deep-red); padding-bottom: 8px; margin-bottom: 15px; }
                .logo { width: 80px; }
                .header-center { flex: 1; text-align: center; padding: 0 15px; }
                .header-center h2 { margin: 0 0 5px 0; color: var(--dark-red); font-size: 14pt; }
                .header-center p { margin: 0; font-size: 8pt; color: #555; }
                .header-right { text-align: right; font-size: 8pt; color: #555; }

                .title-bar h3 { font-size: 12pt; font-weight: bold; margin: 0 0 15px 0; color: var(--deep-red); text-align: right; letter-spacing: 1px; }
                
                .details-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .details-col { width: 48%; display: flex; flex-direction: column; gap: 5px; }
                .detail-item { display: flex; align-items: flex-end; }
                .detail-item strong { flex: 0 0 90px; color: #444; }
                .line-input { flex: 1; border-bottom: 1px solid #ddd; padding: 0 5px; font-weight: bold; color: #000; }

                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: var(--deep-red); color: white; padding: 8px; font-weight: bold; font-size: 8pt; border: 1px solid var(--deep-red); }
                td { border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle; }
                
                .footer-grid { display: flex; justify-content: space-between; margin-top: 10px; }
                .footer-col.left { width: 60%; }
                .footer-col.right { width: 35%; }

                .total-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
                .total-row.total-due { font-weight: bold; font-size: 11pt; color: var(--deep-red); border-top: 2px solid var(--deep-red); border-bottom: none; margin-top: 5px; padding-top: 5px; }
            </style>
        </head>
        <body>
            <div class="page">
                ${generateServiceCopyHtml("Patient Copy", invoice, logoBase64)}
                <div style="height: 30px;"></div> 
                ${generateServiceCopyHtml("Clinic Copy", invoice, logoBase64)}
            </div>
        </body>
        </html>
    `;
}
