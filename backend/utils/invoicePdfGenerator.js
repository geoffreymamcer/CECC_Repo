// backend/utils/invoicePdfGenerator.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";

// Helper to safely get nested prescription values
const getPrescriptionValue = (item, eye, field) => {
  return item.prescription?.[eye]?.[field] || "";
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Helper to format time (e.g., HH:MM AM/PM)
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};

const generateInvoicePdf = async (invoiceData, patientProfile) => {
  // Load the existing PDF template
  const templatePath = path.resolve(
    process.cwd(),
    "src/AdminSideAssets/CECC-INVOICE-TEMPLATE.pdf"
  );
  const existingPdfBytes = await fs.readFile(templatePath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Set font for consistent text if needed
  // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // --- Fill Patient Copy ---
  // General Info
  form.setText("Invoice Number 1", invoiceData.invoiceNumber || "");
  form.setText("Job Order No 1", invoiceData.jobOrderNumber || ""); // Assuming there's a field for JO in Patient Copy
  form.setText("Invoice Date 1", formatDate(invoiceData.invoiceDate) || "");
  form.setText("Invoice Time 1", formatTime(invoiceData.invoiceDate) || "");
  form.setText("Created By 1", invoiceData.createdBy || "");
  form.setText("Delivery Date 1", formatDate(invoiceData.deliveryDate) || "");

  // Patient Info
  form.setText("Patient ID 1", invoiceData.patientId || "");
  form.setText("Patient Name 1", invoiceData.patientName || "");
  form.setText("Patient Address 1", invoiceData.patientAddress || "");
  form.setText("Patient Telephone 1", invoiceData.patientPhoneNumber || ""); // From model

  // Itemized Products & Services
  // Assuming your PDF template has a fixed number of rows for items (e.g., 5 rows per copy)
  // You will need to map these to actual field names in your PDF
  const maxItems = 5; // Adjust based on your template's design
  for (let i = 0; i < maxItems; i++) {
    const item = invoiceData.items[i];
    if (item) {
      form.setText(`Item Description ${i + 1} 1`, item.itemName || "");
      form.setText(`Quantity ${i + 1} 1`, item.qty.toString());
      form.setText(`Unit Price ${i + 1} 1`, item.unitPrice.toFixed(2));
      form.setText(`Discount ${i + 1} 1`, item.discount.toFixed(2));
      form.setText(`Total ${i + 1} 1`, item.price.toFixed(2));
    } else {
      // Clear unused fields if the invoice has fewer than maxItems
      form.setText(`Item Description ${i + 1} 1`, "");
      form.setText(`Quantity ${i + 1} 1`, "");
      form.setText(`Unit Price ${i + 1} 1`, "");
      form.setText(`Discount ${i + 1} 1`, "");
      form.setText(`Total ${i + 1} 1`, "");
    }
  }

  // Summary
  form.setText("Subtotal 1", invoiceData.totalAmount.toFixed(2));
  form.setText("Amount Paid 1", (invoiceData.amountPaid || 0).toFixed(2)); // Need to add amountPaid to invoiceSchema
  form.setText(
    "Total Amount Due 1",
    (invoiceData.totalAmount - (invoiceData.amountPaid || 0)).toFixed(2)
  );
  form.setText("Notes 1", invoiceData.notes || ""); // Assuming notes field exists in Patient Copy

  // --- Fill Clinic Copy (similar to Patient Copy, but with specific fields for Clinic) ---
  // General Info
  form.setText("Invoice Number 2", invoiceData.invoiceNumber || "");
  form.setText("Job Order No 2", invoiceData.jobOrderNumber || "");
  form.setText("Invoice Date 2", formatDate(invoiceData.invoiceDate) || "");
  form.setText("Invoice Time 2", formatTime(invoiceData.invoiceDate) || "");
  form.setText("Created By 2", invoiceData.createdBy || ""); // This might be "Release By" in clinic copy
  form.setText("Delivery Date 2", formatDate(invoiceData.deliveryDate) || "");

  // Patient Info
  form.setText("Patient ID 2", invoiceData.patientId || "");
  form.setText("Patient Name 2", invoiceData.patientName || "");
  form.setText("Patient Address 2", invoiceData.patientAddress || "");
  form.setText("Patient Telephone 2", invoiceData.patientPhoneNumber || "");

  // Itemized Products & Services
  for (let i = 0; i < maxItems; i++) {
    const item = invoiceData.items[i];
    if (item) {
      form.setText(`Item Description ${i + 1} 2`, item.itemName || "");
      form.setText(`Quantity ${i + 1} 2`, item.qty.toString());
      form.setText(`Unit Price ${i + 1} 2`, item.unitPrice.toFixed(2));
      form.setText(`Discount ${i + 1} 2`, item.discount.toFixed(2));
      form.setText(`Total ${i + 1} 2`, item.price.toFixed(2));
    } else {
      form.setText(`Item Description ${i + 1} 2`, "");
      form.setText(`Quantity ${i + 1} 2`, "");
      form.setText(`Unit Price ${i + 1} 2`, "");
      form.setText(`Discount ${i + 1} 2`, "");
      form.setText(`Total ${i + 1} 2`, "");
    }
  }

  // Prescription Details for Lenses (Clinic Copy)
  // Assuming the prescription fields are global on the clinic copy or per-item.
  // Given the template structure, it looks like there's a section for R/L eye prescription below the items table.
  // If multiple lens items, you might need to decide how to represent this or assume one lens item per invoice.
  // For simplicity, let's assume it picks the first lens item's prescription.
  const firstLensItem = invoiceData.items.find((item) => item.isLens);

  if (firstLensItem) {
    // Right Eye
    form.setText(
      "R Sph 2",
      getPrescriptionValue(firstLensItem, "rightEye", "sph")
    );
    form.setText(
      "R Cyl 2",
      getPrescriptionValue(firstLensItem, "rightEye", "cyl")
    );
    form.setText(
      "R Axis 2",
      getPrescriptionValue(firstLensItem, "rightEye", "axis")
    );
    form.setText(
      "R Add 2",
      getPrescriptionValue(firstLensItem, "rightEye", "add")
    );
    form.setText(
      "R PD 2",
      getPrescriptionValue(firstLensItem, "rightEye", "pd")
    );
    form.setText(
      "R Mono PD 2",
      getPrescriptionValue(firstLensItem, "rightEye", "monoPd")
    );
    form.setText(
      "R SH 2",
      getPrescriptionValue(firstLensItem, "rightEye", "sh")
    );
    form.setText(
      "R BC 2",
      getPrescriptionValue(firstLensItem, "rightEye", "bc")
    );
    form.setText(
      "R Dia 2",
      getPrescriptionValue(firstLensItem, "rightEye", "dia")
    );

    // Left Eye
    form.setText(
      "L Sph 2",
      getPrescriptionValue(firstLensItem, "leftEye", "sph")
    );
    form.setText(
      "L Cyl 2",
      getPrescriptionValue(firstLensItem, "leftEye", "cyl")
    );
    form.setText(
      "L Axis 2",
      getPrescriptionValue(firstLensItem, "leftEye", "axis")
    );
    form.setText(
      "L Add 2",
      getPrescriptionValue(firstLensItem, "leftEye", "add")
    );
    form.setText(
      "L PD 2",
      getPrescriptionValue(firstLensItem, "leftEye", "pd")
    );
    form.setText(
      "L Mono PD 2",
      getPrescriptionValue(firstLensItem, "leftEye", "monoPd")
    );
    form.setText(
      "L SH 2",
      getPrescriptionValue(firstLensItem, "leftEye", "sh")
    );
    form.setText(
      "L BC 2",
      getPrescriptionValue(firstLensItem, "leftEye", "bc")
    );
    form.setText(
      "L Dia 2",
      getPrescriptionValue(firstLensItem, "leftEye", "dia")
    );

    form.setText("Tint 2", firstLensItem.tint || ""); // Tint field for the lens
  } else {
    // Clear prescription fields if no lens item
    // Right Eye
    form.setText("R Sph 2", "");
    form.setText("R Cyl 2", "");
    form.setText("R Axis 2", "");
    form.setText("R Add 2", "");
    form.setText("R PD 2", "");
    form.setText("R Mono PD 2", "");
    form.setText("R SH 2", "");
    form.setText("R BC 2", "");
    form.setText("R Dia 2", "");
    // Left Eye
    form.setText("L Sph 2", "");
    form.setText("L Cyl 2", "");
    form.setText("L Axis 2", "");
    form.setText("L Add 2", "");
    form.setText("L PD 2", "");
    form.setText("L Mono PD 2", "");
    form.setText("L SH 2", "");
    form.setText("L BC 2", "");
    form.setText("L Dia 2", "");
    form.setText("Tint 2", "");
  }

  // Summary
  form.setText("Subtotal 2", invoiceData.totalAmount.toFixed(2));
  form.setText("Amount Paid 2", (invoiceData.amountPaid || 0).toFixed(2));
  form.setText(
    "Total Amount Due 2",
    (invoiceData.totalAmount - (invoiceData.amountPaid || 0)).toFixed(2)
  );
  form.setText("Notes 2", invoiceData.notes || "");

  // --- Fill Laboratory Copy (similar structure, potentially different fields like "Frame", "Lens") ---
  // General Info
  form.setText("Invoice Number 3", invoiceData.invoiceNumber || "");
  form.setText("Job Order No 3", invoiceData.jobOrderNumber || "");
  form.setText("Invoice Date 3", formatDate(invoiceData.invoiceDate) || "");
  form.setText("Invoice Time 3", formatTime(invoiceData.invoiceDate) || "");
  form.setText("Created By 3", invoiceData.createdBy || "");
  form.setText("Delivery Date 3", formatDate(invoiceData.deliveryDate) || "");

  // Patient Info
  form.setText("Patient ID 3", invoiceData.patientId || "");
  form.setText("Patient Name 3", invoiceData.patientName || "");
  form.setText("Patient Address 3", invoiceData.patientAddress || "");
  form.setText("Patient Telephone 3", invoiceData.patientPhoneNumber || "");

  // Specific Lab fields
  const frameItem = invoiceData.items.find((item) => !item.isLens); // Assuming first non-lens is frame
  if (frameItem) {
    form.setText("Frame 3", frameItem.itemName); // Assuming a 'Frame' field
  } else {
    form.setText("Frame 3", "");
  }

  if (firstLensItem) {
    form.setText("Lens 3", firstLensItem.itemName); // Assuming a 'Lens' field
    form.setText("Delivery Date 3 (Lab)", formatDate(invoiceData.deliveryDate)); // If lab has its own delivery date field
    form.setText("Lab Pick Up Date and Time 3", ""); // This might be filled manually later

    // Right Eye
    form.setText(
      "R Sph 3",
      getPrescriptionValue(firstLensItem, "rightEye", "sph")
    );
    form.setText(
      "R Cyl 3",
      getPrescriptionValue(firstLensItem, "rightEye", "cyl")
    );
    form.setText(
      "R Axis 3",
      getPrescriptionValue(firstLensItem, "rightEye", "axis")
    );
    form.setText(
      "R Add 3",
      getPrescriptionValue(firstLensItem, "rightEye", "add")
    );
    form.setText(
      "R PD 3",
      getPrescriptionValue(firstLensItem, "rightEye", "pd")
    );
    form.setText(
      "R Mono PD 3",
      getPrescriptionValue(firstLensItem, "rightEye", "monoPd")
    );
    form.setText(
      "R SH 3",
      getPrescriptionValue(firstLensItem, "rightEye", "sh")
    );
    form.setText(
      "R BC 3",
      getPrescriptionValue(firstLensItem, "rightEye", "bc")
    );
    form.setText(
      "R Dia 3",
      getPrescriptionValue(firstLensItem, "rightEye", "dia")
    );

    // Left Eye
    form.setText(
      "L Sph 3",
      getPrescriptionValue(firstLensItem, "leftEye", "sph")
    );
    form.setText(
      "L Cyl 3",
      getPrescriptionValue(firstLensItem, "leftEye", "cyl")
    );
    form.setText(
      "L Axis 3",
      getPrescriptionValue(firstLensItem, "leftEye", "axis")
    );
    form.setText(
      "L Add 3",
      getPrescriptionValue(firstLensItem, "leftEye", "add")
    );
    form.setText(
      "L PD 3",
      getPrescriptionValue(firstLensItem, "leftEye", "pd")
    );
    form.setText(
      "L Mono PD 3",
      getPrescriptionValue(firstLensItem, "leftEye", "monoPd")
    );
    form.setText(
      "L SH 3",
      getPrescriptionValue(firstLensItem, "leftEye", "sh")
    );
    form.setText(
      "L BC 3",
      getPrescriptionValue(firstLensItem, "leftEye", "bc")
    );
    form.setText(
      "L Dia 3",
      getPrescriptionValue(firstLensItem, "leftEye", "dia")
    );

    form.setText("Tint 3", firstLensItem.tint || ""); // Tint field for the lens
  } else {
    form.setText("Lens 3", "");
    form.setText("Delivery Date 3 (Lab)", "");
    form.setText("Lab Pick Up Date and Time 3", "");
    // Clear prescription fields if no lens item
    // Right Eye
    form.setText("R Sph 3", "");
    form.setText("R Cyl 3", "");
    form.setText("R Axis 3", "");
    form.setText("R Add 3", "");
    form.setText("R PD 3", "");
    form.setText("R Mono PD 3", "");
    form.setText("R SH 3", "");
    form.setText("R BC 3", "");
    form.setText("R Dia 3", "");
    // Left Eye
    form.setText("L Sph 3", "");
    form.setText("L Cyl 3", "");
    form.setText("L Axis 3", "");
    form.setText("L Add 3", "");
    form.setText("L PD 3", "");
    form.setText("L Mono PD 3", "");
    form.setText("L SH 3", "");
    form.setText("L BC 3", "");
    form.setText("L Dia 3", "");
    form.setText("Tint 3", "");
  }

  // Flatten the form to embed the filled data
  form.flatten();

  return pdfDoc.save();
};

export default generateInvoicePdf;
