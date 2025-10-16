import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAllFields() {
  try {
    console.log("🔍 Testing ALL PDF Form Fields");

    const templatePath = path.join(
      __dirname,
      "../AdminSideAssets/CECC INVOICE TEMPLATE.pdf"
    );

    if (!(await fs.pathExists(templatePath))) {
      console.error("❌ PDF template not found at:", templatePath);
      return;
    }

    console.log("📄 Loading PDF template...");
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    try {
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      console.log(`\n✅ Found ${fields.length} form fields:\n`);

      fields.forEach((field, index) => {
        console.log(`${index + 1}. Field Name: "${field.getName()}"`);
        console.log(`   Type: ${field.constructor.name}`);

        try {
          if (field.constructor.name === "PDFTextField") {
            const currentValue = field.getText();
            console.log(`   Current Value: "${currentValue}"`);
            console.log(`   Is Read Only: ${field.isReadOnly()}`);
            console.log(`   Is Required: ${field.isRequired()}`);
          }
        } catch (e) {
          console.log(`   Error reading field: ${e.message}`);
        }
        console.log(""); // Empty line for readability
      });

      console.log("📋 Summary of all field placeholders:");
      fields.forEach((field, index) => {
        try {
          if (field.constructor.name === "PDFTextField") {
            const currentValue = field.getText();
            console.log(`${index + 1}. "${currentValue}"`);
          }
        } catch (e) {
          console.log(`${index + 1}. [Error reading field]`);
        }
      });
    } catch (formError) {
      console.error("❌ Error accessing form:", formError.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the test
testAllFields();
