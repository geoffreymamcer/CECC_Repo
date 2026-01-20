// backend/services/invoiceTemplate.js

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

// Generates the HTML for one of the three copies (Patient, Clinic, Lab)
function generateCopyHtml(type, invoice, logoBase64) {
  const isLab = type === "Laboratory Copy";
  const hasRx = type !== "Patient Copy";
  const lensItem = invoice.items.find((item) => item.isLens);

  // Generate prescription table rows if applicable
  const prescriptionTable = hasRx
    ? `
        <table class="prescription-table">
            <thead>
                <tr>
                    <th></th><th>Sph</th><th>Cyl</th><th>Axis</th><th>Add</th><th>PD</th>
                    ${
                      !isLab
                        ? "<th>Mono Spd</th><th>SH</th><th>BC</th><th>Dia</th><th>Tint</th>"
                        : ""
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>R</td>
                    <td>${lensItem?.rightEye?.sph || ""}</td>
                    <td>${lensItem?.rightEye?.cyl || ""}</td>
                    <td>${lensItem?.rightEye?.axis || ""}</td>
                    <td>${lensItem?.rightEye?.add || ""}</td>
                    <td>${lensItem?.rightEye?.pd || ""}</td>
                    ${
                      !isLab
                        ? `<td>${lensItem?.rightEye?.monoPd || ""}</td><td>${
                            lensItem?.rightEye?.sh || ""
                          }</td><td>${lensItem?.rightEye?.bc || ""}</td><td>${
                            lensItem?.rightEye?.dia || ""
                          }</td><td>${lensItem?.tint || ""}</td>`
                        : ""
                    }
                </tr>
                <tr>
                    <td>L</td>
                    <td>${lensItem?.leftEye?.sph || ""}</td>
                    <td>${lensItem?.leftEye?.cyl || ""}</td>
                    <td>${lensItem?.leftEye?.axis || ""}</td>
                    <td>${lensItem?.leftEye?.add || ""}</td>
                    <td>${lensItem?.leftEye?.pd || ""}</td>
                    ${
                      !isLab
                        ? `<td>${lensItem?.leftEye?.monoPd || ""}</td><td>${
                            lensItem?.leftEye?.sh || ""
                          }</td><td>${lensItem?.leftEye?.bc || ""}</td><td>${
                            lensItem?.leftEye?.dia || ""
                          }</td><td>${lensItem?.tint || ""}</td>`
                        : ""
                    }
                </tr>
            </tbody>
        </table>
    `
    : "";

  // Generate item rows for the main table
  let itemRows = "";
  const totalRows = 6;
  for (let i = 0; i < totalRows; i++) {
    const item = invoice.items[i];
    itemRows += `
            <tr>
                <td style="text-align: left; padding-left: 5px;">${
                  item?.itemName || ""
                }</td>
                <td>${item?.qty || ""}</td>
                <td>${
                  item?.unitPrice ? formatCurrency(item.unitPrice) : ""
                }</td>
                <td>${item?.discount ? formatCurrency(item.discount) : ""}</td>
                <td>${item?.price ? formatCurrency(item.price) : ""}</td>
            </tr>
        `;
  }

  // Specific fields for Laboratory Copy
  const labFields = isLab
    ? `
        <div class="lab-details">
            <div><strong>Frame:</strong> <span class="line-input">${
              invoice.items.find((i) => !i.isLens)?.itemName || ""
            }</span></div>
            <div><strong>Lense:</strong> <span class="line-input">${
              lensItem?.itemName || ""
            }</span></div>
            <div><strong>Delivery Date:</strong> <span class="line-input">${formatDate(
              invoice.deliveryDate
            )}</span></div>
            <div><strong>Note:</strong> <span class="line-input"></span></div>
            <div><strong>Lab Pick Up Date and Time:</strong> <span class="line-input"></span></div>
        </div>
    `
    : "";

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
                <h3>${type}</h3>
            </div>
            
            <div class="details-grid">
                <div class="details-col">
                    <div class="detail-item"><strong>Date:</strong><span class="line-input">${formatDate(
                      invoice.invoiceDate
                    )}</span></div>
                    <div class="detail-item"><strong>Time:</strong><span class="line-input">${formatTime(
                      invoice.invoiceDate
                    )}</span></div>
                    <div class="detail-item"><strong>Invoice Number:</strong><span class="line-input">${
                      invoice.invoiceNumber
                    }</span></div>
                    ${
                      !isLab
                        ? `<div class="detail-item"><strong>Job Order:</strong><span class="line-input">${invoice.jobOrderNumber}</span></div>`
                        : ""
                    }
                </div>
                <div class="details-col">
                    <div class="detail-item"><strong>Patient ID:</strong><span class="line-input">${
                      invoice.patientId
                    }</span></div>
                    <div class="detail-item"><strong>Patient Name:</strong><span class="line-input">${
                      invoice.patientName
                    }</span></div>
                    <div class="detail-item"><strong>Address:</strong><span class="line-input">${
                      invoice.patientAddress
                    }</span></div>
                    <div class="detail-item"><strong>Telephone:</strong><span class="line-input">${
                      invoice.patientPhoneNumber
                    }</span></div>
                </div>
            </div>

            ${labFields}
            ${prescriptionTable}
            
            <table class="items-table">
                <thead>
                    <tr>
                      <th style="width: 40%;">Item Description</th>
                      <th style="width: 10%;">Quantity</th>
                      <th style="width: 15%;">Unit Price</th>
                      <th style="width: 15%;">Discount</th>
                      <th style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
            </table>

            <div class="footer-grid">
                <div class="footer-col left">
                    ${
                      !isLab
                        ? `<div><strong>Delivery Date:</strong> <span class="line-input">${formatDate(
                            invoice.deliveryDate
                          )}</span></div>`
                        : ""
                    }
                    <div><strong>Created By:</strong> <span class="line-input">${
                      invoice.creatorName || invoice.createdBy
                    }</span></div>
                    ${
                      !isLab
                        ? `<div><strong>Release Date:</strong> <span class="line-input"></span></div>`
                        : ""
                    }
                    ${
                      !isLab
                        ? `<div><strong>Release By:</strong> <span class="line-input"></span></div>`
                        : ""
                    }
                </div>
                <div class="footer-col center">
                    <div class="signature-line"><strong>Conforme</strong></div>
                    <div class="signature-line"><strong>Date</strong></div>
                     ${
                       !isLab
                         ? `<div class="signature-line"><strong>Item received in good condition by</strong></div>`
                         : ""
                     }
                    ${
                      !isLab
                        ? `<div class="signature-line"><strong>Received date</strong></div>`
                        : ""
                    }
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
        </div>
    `;
}

// Main function to assemble the full HTML document
export function getInvoiceHtml(invoice, logoBase64) {
  return `
           <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Invoice - ${invoice.invoiceNumber}</title>
            <style>
                :root {
                    --deep-red: #7F0000;
                    --dark-red: #8B0000;
                }
                html { -webkit-print-color-adjust: exact; }
                body { font-family: Arial, sans-serif; font-size: 8.5pt; color: #333; margin: 0; }
                .page { padding: 0; }

                /* 1️⃣ START MODIFICATION: Updated Styles to Match Service Invoice */
                .copy-container { 
                    padding-bottom: 5mm; 
                    margin-bottom: 5mm;
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

                /* Tables */
                .prescription-table, .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                
                /* Header Style Match */
                .items-table th, .prescription-table th { 
                    background-color: var(--deep-red); 
                    color: white; 
                    padding: 8px; 
                    font-weight: bold; 
                    font-size: 8pt; 
                    border: 1px solid var(--deep-red); 
                }
                
                td { border: 1px solid #ddd; padding: 6px; text-align: center; vertical-align: middle; }
                .items-table td:first-child { text-align: left; }
                .items-table td:not(:first-child) { text-align: right; }

                /* Footer */
                .footer-grid { display: flex; justify-content: space-between; margin-top: 10px; }
                .footer-col.left { width: 33%; gap: 8px; }
                .footer-col.center { width: 33%; align-items: center; justify-content: flex-end; gap: 20px; text-align: center; }
                .footer-col.right { width: 33%; align-items: flex-end; }

                .signature-line { border-top: 1px solid #333; padding-top: 5px; width: 180px; }
                
                .total-row { display: flex; justify-content: space-between; width: 220px; padding: 4px 0; border-bottom: 1px solid #eee; }
                .total-row.total-due { font-weight: bold; font-size: 11pt; color: var(--deep-red); border-top: 2px solid var(--deep-red); border-bottom: none; margin-top: 5px; padding-top: 5px; }
                .total-row span:first-child { margin-right: 10px; }
                
                .lab-details { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
                /* 1️⃣ END MODIFICATION */
            </style>
        </head>
        <body>
            <div class="page">
                ${generateCopyHtml("Patient Copy", invoice, logoBase64)}
                ${generateCopyHtml("Clinic Copy", invoice, logoBase64)}
                ${generateCopyHtml("Laboratory Copy", invoice, logoBase64)}
            </div>
        </body>
        </html>
    `;
}
