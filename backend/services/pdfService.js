import { PDFDocument, PDFForm, rgb, StandardFonts } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.templatePath = path.join(
      __dirname,
      "../AdminSideAssets/CECC-Invoice-Template.pdf"
    );
  }

  async generateInvoicePDF(invoiceData) {
    try {
      // Read the PDF template
      const templateBytes = await fs.readFile(this.templatePath);

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(templateBytes);

      // Try to get the form first
      let form;
      let hasFormFields = false;

      try {
        form = pdfDoc.getForm();
        const fields = form.getFields();
        hasFormFields = fields.length > 0;

        console.log(
          `PDF template analysis: ${fields.length} form fields found`
        );

        if (hasFormFields) {
          // Template has form fields, fill them
          console.log("Using form field filling method...");
          await this.fillFormFields(form, invoiceData);
          form.flatten();
          console.log("Form fields filled and flattened successfully");
        } else {
          // No form fields, add text overlays
          console.log("No form fields found, using text overlay method...");
          await this.addTextOverlays(pdfDoc, invoiceData);
        }
      } catch (formError) {
        // No form available, add text overlays
        console.log("Form not available, using text overlay method...");
        await this.addTextOverlays(pdfDoc, invoiceData);
      }

      // Save the filled PDF
      const pdfBytes = await pdfDoc.save();
      console.log(`PDF generated successfully, size: ${pdfBytes.length} bytes`);

      return pdfBytes;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF invoice");
    }
  }

  async fillFormFields(form, invoiceData) {
    try {
      // Get all form fields
      const fields = form.getFields();
      console.log(`Found ${fields.length} form fields in template`);

      // ==========================
      // Explicit field name mapping
      // ==========================
      const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
      const subtotal = items.reduce(
        (sum, it) => sum + (it.qty || 0) * (it.unitPrice || 0),
        0
      );
      const totalDiscount = items.reduce(
        (sum, it) => sum + (it.discount || 0),
        0
      );
      const amountPaid = Number(invoiceData.amountPaid || 0);
      const totalDue = Math.max(subtotal - totalDiscount - amountPaid, 0);

      // Header fields (using actual PDF field names)
      this.tryFillField(form, "Patient ID", invoiceData.patientId || "");
      this.tryFillField(form, "Date", this.formatDate(invoiceData.invoiceDate));
      this.tryFillField(form, "Name", invoiceData.patientName || "");
      this.tryFillField(form, "Time", this.formatTime(invoiceData.invoiceDate));
      this.tryFillField(form, "Address", invoiceData.patientAddress || "");
      this.tryFillField(
        form,
        "Invoice Number",
        invoiceData.invoiceNumber || ""
      );
      this.tryFillField(
        form,
        "Telephone",
        invoiceData.patientPhoneNumber || ""
      );
      this.tryFillField(form, "Job Order", invoiceData.jobOrderNumber || "");

      // Items 1-5 (using actual field names from your PDF)
      for (let i = 0; i < 5; i++) {
        const idx = i + 1;
        const it = items[i] || {};
        const itemTotal =
          (it.qty || 0) * (it.unitPrice || 0) - (it.discount || 0);
        this.tryFillField(form, `Item ${idx}`, it.itemName || "");
        this.tryFillField(form, `Item ${idx} Quantity`, String(it.qty ?? ""));
        this.tryFillField(
          form,
          `Item ${idx} Price`,
          String(it.unitPrice ?? "")
        );
        this.tryFillField(
          form,
          `Item ${idx} Discount`,
          String(it.discount ?? "")
        );
        this.tryFillField(
          form,
          `Item ${idx} Total`,
          this.formatCurrency(itemTotal)
        );
      }

      // Totals & payments
      this.tryFillField(form, "Subtotal", this.formatCurrency(subtotal));
      this.tryFillField(form, "Amount Paid", this.formatCurrency(amountPaid));
      this.tryFillField(
        form,
        "Total Amount Due",
        this.formatCurrency(totalDue)
      );

      // Prescription fields (using actual field names from your PDF)
      const lensItems = items.filter((x) => x.isLens);
      const lens = lensItems[0] || {};

      if (lens.rightEye) {
        const re = lens.rightEye;
        this.tryFillField(form, "Sph-R", re.sph || "");
        this.tryFillField(form, "Cyl R", re.cyl || "");
        this.tryFillField(form, "Axis R", re.axis || "");
        this.tryFillField(form, "Add R", re.add || "");
        this.tryFillField(form, "PD R", re.pd || "");
        // Try multiple variations for Mono PD field
        console.log("Trying to fill Mono PD R with value:", re.monoPd);
        this.tryFillField(form, "Mono SPD R", re.monoPd || "");
        this.tryFillField(form, "Mono PD R", re.monoPd || "");
        this.tryFillField(form, "Mono_PD_R", re.monoPd || "");
        this.tryFillField(form, "MonoPD R", re.monoPd || "");
        this.tryFillField(form, "SH R", re.sh || "");
        this.tryFillField(form, "BC R", re.bc || "");
        this.tryFillField(form, "Dia R", re.dia || "");
      }

      if (lens.leftEye) {
        const le = lens.leftEye;
        this.tryFillField(form, "Sph-L", le.sph || "");
        this.tryFillField(form, "Cyl L", le.cyl || "");
        this.tryFillField(form, "Axis L", le.axis || "");
        this.tryFillField(form, "Add L", le.add || "");
        this.tryFillField(form, "PD L", le.pd || "");
        // Try multiple variations for Mono PD field
        console.log("Trying to fill Mono PD L with value:", le.monoPd);
        this.tryFillField(form, "Mono SPD L", le.monoPd || "");
        this.tryFillField(form, "Mono PD L", le.monoPd || "");
        this.tryFillField(form, "Mono_PD_L", le.monoPd || "");
        this.tryFillField(form, "MonoPD L", le.monoPd || "");
        this.tryFillField(form, "SH L", le.sh || "");
        this.tryFillField(form, "BC L", le.bc || "");
        this.tryFillField(form, "Dia L", le.dia || "");
      }

      // Tint
      if (lens.tint) {
        this.tryFillField(form, "Tint", lens.tint);
      }

      // Auto-detect field mappings based on field names and common patterns (fallback)
      const fieldMappings = this.autoDetectFieldMappings(fields, invoiceData);

      console.log("Auto-detected field mappings:", Object.keys(fieldMappings));

      // Fill each detected field
      for (const [fieldName, value] of Object.entries(fieldMappings)) {
        try {
          const field = form.getField(fieldName);
          if (field) {
            if (field.constructor.name === "PDFTextField") {
              field.setText(value);
              console.log(`Filled field "${fieldName}" with: "${value}"`);
            } else if (field.constructor.name === "PDFCheckBox") {
              if (value === true || value === "true") {
                field.check();
                console.log(`Checked field "${fieldName}"`);
              } else {
                field.uncheck();
                console.log(`Unchecked field "${fieldName}"`);
              }
            }
          }
        } catch (fieldError) {
          console.log(`Field ${fieldName} not found or not fillable`);
        }
      }

      // Handle prescription fields if they exist
      if (invoiceData.items && invoiceData.items.length > 0) {
        const lensItems = invoiceData.items.filter((item) => item.isLens);
        if (lensItems.length > 0) {
          const firstLens = lensItems[0];
          this.fillPrescriptionFields(form, firstLens);
        }
      }

      console.log("Form fields filled successfully");
    } catch (error) {
      console.error("Error filling form fields:", error);
      throw error;
    }
  }

  // Auto-detect field mappings based on field names and common patterns
  autoDetectFieldMappings(fields, invoiceData) {
    const mappings = {};

    // Get all field names for debugging
    const fieldNames = fields.map((f) => f.getName());
    console.log("Available field names:", fieldNames);

    // Map fields based on their current placeholder values
    fields.forEach((field) => {
      try {
        if (field.constructor.name === "PDFTextField") {
          const currentValue = field.getText().toLowerCase();
          let mappedValue = null;

          // Map based on placeholder content
          if (currentValue.includes("date")) {
            mappedValue = this.formatDate(invoiceData.invoiceDate);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Invoice Date: "${mappedValue}"`
            );
          } else if (currentValue.includes("time")) {
            mappedValue = this.formatTime(invoiceData.invoiceDate);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Time: "${mappedValue}"`
            );
          } else if (currentValue.includes("invoice number")) {
            mappedValue = invoiceData.invoiceNumber || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Invoice Number: "${mappedValue}"`
            );
          } else if (currentValue.includes("patient id")) {
            mappedValue = invoiceData.patientId || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Patient ID: "${mappedValue}"`
            );
          } else if (currentValue.includes("patient name")) {
            mappedValue = invoiceData.patientName || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Patient Name: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("patient address") ||
            currentValue.includes("address")
          ) {
            mappedValue = invoiceData.patientAddress || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Patient Address: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("phone") ||
            currentValue.includes("contact") ||
            currentValue.includes("telephone")
          ) {
            mappedValue = invoiceData.patientTelephone || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Patient Phone: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("total") ||
            currentValue.includes("amount")
          ) {
            const totalAmount = invoiceData.items.reduce((sum, item) => {
              const itemTotal =
                (item.qty || 0) * (item.unitPrice || 0) - (item.discount || 0);
              return sum + itemTotal;
            }, 0);
            mappedValue = this.formatCurrency(totalAmount);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Total Amount: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("notes") ||
            currentValue.includes("comment")
          ) {
            mappedValue = invoiceData.notes || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Notes: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("job order") ||
            currentValue.includes("job order number") ||
            currentValue.includes("job order no")
          ) {
            mappedValue = invoiceData.jobOrderNumber || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Job Order Number: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("delivery") ||
            currentValue.includes("delivery date")
          ) {
            mappedValue = this.formatDate(invoiceData.deliveryDate);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Delivery Date: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("created by") ||
            currentValue.includes("created by user") ||
            currentValue.includes("user")
          ) {
            mappedValue = invoiceData.createdBy || "";
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Created By: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("subtotal") ||
            currentValue.includes("sub total")
          ) {
            const subtotal = invoiceData.items.reduce((sum, item) => {
              const itemTotal = (item.qty || 0) * (item.unitPrice || 0);
              return sum + itemTotal;
            }, 0);
            mappedValue = this.formatCurrency(subtotal);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Subtotal: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("discount") ||
            currentValue.includes("total discount")
          ) {
            const totalDiscount = invoiceData.items.reduce((sum, item) => {
              return sum + (item.discount || 0);
            }, 0);
            mappedValue = this.formatCurrency(totalDiscount);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Total Discount: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("amount paid") ||
            currentValue.includes("paid amount")
          ) {
            mappedValue = this.formatCurrency(invoiceData.amountPaid || 0);
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Amount Paid: "${mappedValue}"`
            );
          } else if (
            currentValue.includes("balance") ||
            currentValue.includes("amount due") ||
            currentValue.includes("due amount")
          ) {
            const subtotal = invoiceData.items.reduce((sum, item) => {
              const itemTotal = (item.qty || 0) * (item.unitPrice || 0);
              return sum + itemTotal;
            }, 0);
            const totalDiscount = invoiceData.items.reduce((sum, item) => {
              return sum + (item.discount || 0);
            }, 0);
            const amountPaid = invoiceData.amountPaid || 0;
            const balance = subtotal - totalDiscount - amountPaid;
            mappedValue = this.formatCurrency(Math.max(balance, 0));
            console.log(
              `Mapping field "${field.getName()}" (${currentValue}) -> Balance Due: "${mappedValue}"`
            );
          }

          // If we found a mapping, add it
          if (mappedValue !== null) {
            mappings[field.getName()] = mappedValue;
          }
        }
      } catch (e) {
        console.log(`Error processing field ${field.getName()}: ${e.message}`);
      }
    });

    console.log(`\n✅ Total fields mapped: ${Object.keys(mappings).length}`);

    return mappings;
  }

  // Fill prescription fields for lens items
  fillPrescriptionFields(form, lensItem) {
    const prescriptionFields = [
      "sph",
      "cyl",
      "axis",
      "add",
      "pd",
      "mono_pd",
      "sh",
      "bc",
      "dia",
    ];

    // Right eye prescription
    if (lensItem.rightEye) {
      prescriptionFields.forEach((field) => {
        if (lensItem.rightEye[field]) {
          this.tryFillField(form, `right_${field}`, lensItem.rightEye[field]);
          this.tryFillField(form, `r_${field}`, lensItem.rightEye[field]);
          this.tryFillField(form, `re_${field}`, lensItem.rightEye[field]);
        }
      });
    }

    // Left eye prescription
    if (lensItem.leftEye) {
      prescriptionFields.forEach((field) => {
        if (lensItem.leftEye[field]) {
          this.tryFillField(form, `left_${field}`, lensItem.leftEye[field]);
          this.tryFillField(form, `l_${field}`, lensItem.leftEye[field]);
          this.tryFillField(form, `le_${field}`, lensItem.leftEye[field]);
        }
      });
    }

    // Tint field
    if (lensItem.tint) {
      this.tryFillField(form, "tint", lensItem.tint);
      this.tryFillField(form, "lens_tint", lensItem.tint);
    }
  }

  // Try to fill a field with multiple possible names
  tryFillField(form, fieldName, value) {
    try {
      const field = form.getField(fieldName);
      if (field && field.constructor.name === "PDFTextField") {
        field.setText(value);
        console.log(
          `Filled prescription field "${fieldName}" with: "${value}"`
        );
        return true;
      }
    } catch (e) {
      // Field doesn't exist, continue
    }
    return false;
  }

  async addTextOverlays(pdfDoc, invoiceData) {
    try {
      // Get the first page
      const pages = pdfDoc.getPages();
      if (pages.length === 0) return;

      const page = pages[0];
      const { width, height } = page.getSize();

      // Embed the standard font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;

      // Calculate total amount from items
      const totalAmount = invoiceData.items.reduce((sum, item) => {
        const itemTotal =
          (item.qty || 0) * (item.unitPrice || 0) - (item.discount || 0);
        return sum + itemTotal;
      }, 0);

      // Define text positions - YOU NEED TO ADJUST THESE COORDINATES
      // to match your actual invoice template layout
      const textPositions = {
        // Header section (top of invoice)
        invoiceNumber: { x: 150, y: height - 100, label: "Invoice #:" },
        jobOrderNumber: { x: 150, y: height - 120, label: "Job Order #:" },
        invoiceDate: { x: 150, y: height - 140, label: "Date:" },
        deliveryDate: { x: 150, y: height - 160, label: "Delivery:" },

        // Patient information section
        patientName: { x: 150, y: height - 200, label: "Patient:" },
        patientAddress: { x: 150, y: height - 220, label: "Address:" },
        patientPhone: { x: 150, y: height - 240, label: "Phone:" },

        // Items table header
        itemsHeader: { x: 150, y: height - 280, label: "Items:" },

        // Totals section
        subtotal: { x: 150, y: height - 400, label: "Subtotal:" },
        totalAmount: { x: 150, y: height - 420, label: "Total:" },
        notes: { x: 150, y: height - 450, label: "Notes:" },
      };

      // Add header information
      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.invoiceNumber,
        invoiceData.invoiceNumber || ""
      );

      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.jobOrderNumber,
        invoiceData.jobOrderNumber || ""
      );

      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.invoiceDate,
        this.formatDate(invoiceData.invoiceDate)
      );

      if (invoiceData.deliveryDate) {
        this.drawTextWithLabel(
          page,
          font,
          fontSize,
          textPositions.deliveryDate,
          this.formatDate(invoiceData.deliveryDate)
        );
      }

      // Add patient information
      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.patientName,
        invoiceData.patientName || ""
      );

      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.patientAddress,
        invoiceData.patientAddress || ""
      );

      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.patientPhone,
        invoiceData.patientPhoneNumber || ""
      );

      // Add items table
      let itemY = height - 300;
      const itemStartX = 150;
      const itemSpacing = 25;

      // Draw items header
      page.drawText("Item Description | Qty | Unit Price | Discount | Total", {
        x: itemStartX,
        y: itemY,
        size: fontSize - 1,
        font,
        color: rgb(0, 0, 0),
      });
      itemY -= itemSpacing;

      // Draw each item
      invoiceData.items.forEach((item, index) => {
        if (index < 8) {
          // Limit to 8 items to fit on page
          const itemTotal =
            (item.qty || 0) * (item.unitPrice || 0) - (item.discount || 0);

          const itemText = `${item.itemName || ""} | ${
            item.qty || 0
          } | PHP ${this.formatCurrency(
            item.unitPrice || 0
          )} | PHP ${this.formatCurrency(
            item.discount || 0
          )} | PHP ${this.formatCurrency(itemTotal)}`;

          page.drawText(itemText, {
            x: itemStartX,
            y: itemY,
            size: fontSize - 2,
            font,
            color: rgb(0, 0, 0),
          });
          itemY -= itemSpacing;

          // Add prescription details for lens items
          if (item.isLens && (item.rightEye || item.leftEye)) {
            itemY -= 5;
            if (
              item.rightEye &&
              Object.keys(item.rightEye).some((key) => item.rightEye[key])
            ) {
              const rightEyeText = `Right Eye: ${this.formatPrescription(
                item.rightEye
              )}`;
              page.drawText(rightEyeText, {
                x: itemStartX + 20,
                y: itemY,
                size: fontSize - 3,
                font,
                color: rgb(0.5, 0.5, 0.5),
              });
              itemY -= 15;
            }

            if (
              item.leftEye &&
              Object.keys(item.leftEye).some((key) => item.leftEye[key])
            ) {
              const leftEyeText = `Left Eye: ${this.formatPrescription(
                item.leftEye
              )}`;
              page.drawText(leftEyeText, {
                x: itemStartX + 20,
                y: itemY,
                size: fontSize - 3,
                font,
                color: rgb(0.5, 0.5, 0.5),
              });
              itemY -= 15;
            }

            if (item.tint) {
              const tintText = `Tint: ${item.tint}`;
              page.drawText(tintText, {
                x: itemStartX + 20,
                y: itemY,
                size: fontSize - 3,
                font,
                color: rgb(0.5, 0.5, 0.5),
              });
              itemY -= 15;
            }
          }
        }
      });

      // Add totals
      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.subtotal,
        `PHP ${this.formatCurrency(totalAmount)}`
      );

      this.drawTextWithLabel(
        page,
        font,
        fontSize,
        textPositions.totalAmount,
        `PHP ${this.formatCurrency(totalAmount)}`
      );

      // Add notes
      if (invoiceData.notes) {
        this.drawTextWithLabel(
          page,
          font,
          fontSize,
          textPositions.notes,
          invoiceData.notes
        );
      }
    } catch (error) {
      console.error("Error adding text overlays:", error);
      throw error;
    }
  }

  // Helper method to draw text with label
  drawTextWithLabel(page, font, fontSize, position, value) {
    if (!value) return;

    // Draw the label
    page.drawText(position.label, {
      x: position.x,
      y: position.y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Draw the value (offset to the right of the label)
    const labelWidth = font.widthOfTextAtSize(position.label, fontSize);
    page.drawText(value.toString(), {
      x: position.x + labelWidth + 10,
      y: position.y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  // Helper method to format prescription data
  formatPrescription(eyeData) {
    const parts = [];
    if (eyeData.sph) parts.push(`Sph: ${eyeData.sph}`);
    if (eyeData.cyl) parts.push(`Cyl: ${eyeData.cyl}`);
    if (eyeData.axis) parts.push(`Axis: ${eyeData.axis}`);
    if (eyeData.add) parts.push(`Add: ${eyeData.add}`);
    if (eyeData.pd) parts.push(`PD: ${eyeData.pd}`);
    if (eyeData.monoPd) parts.push(`Mono PD: ${eyeData.monoPd}`);
    if (eyeData.sh) parts.push(`SH: ${eyeData.sh}`);
    if (eyeData.bc) parts.push(`BC: ${eyeData.bc}`);
    if (eyeData.dia) parts.push(`Dia: ${eyeData.dia}`);

    return parts.join(", ") || "No prescription data";
  }

  formatDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  formatTime(date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  formatCurrency(amount) {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  }

  // Method to get field names from template (for debugging)
  async getTemplateFields() {
    try {
      const templateBytes = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      return fields.map((field) => ({
        name: field.getName(),
        type: field.constructor.name,
      }));
    } catch (error) {
      console.error("Error reading template fields:", error);
      return [];
    }
  }
}

export default new PDFService();
