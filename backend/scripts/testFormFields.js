import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFormFields() {
  try {
    console.log("🔍 Testing PDF Form Fields");

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

      console.log(`\n✅ Found ${fields.length} form fields:`);

      fields.forEach((field, index) => {
        console.log(`\n${index + 1}. Field Name: "${field.getName()}"`);
        console.log(`   Type: ${field.constructor.name}`);

        // Try to get the current value
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
      });

      // Test filling a field
      console.log("\n🧪 Testing field filling...");
      if (fields.length > 0) {
        const testField = fields[0];
        console.log(`Testing with field: "${testField.getName()}"`);

        try {
          testField.setText("TEST VALUE");
          console.log("✅ Successfully set test value");

          const newValue = testField.getText();
          console.log(`New value: "${newValue}"`);
        } catch (e) {
          console.log(`❌ Error setting value: ${e.message}`);
        }
      }
    } catch (formError) {
      console.error("❌ Error accessing form:", formError.message);
      console.log("This PDF might not have proper form fields");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the test
testFormFields();
