import pdfService from "../services/pdfService.js";

async function analyzeTemplate() {
  try {
    console.log("Analyzing PDF template...");
    const fields = await pdfService.getTemplateFields();

    console.log("\n=== PDF Template Fields ===");
    console.log(`Total fields found: ${fields.length}\n`);

    fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (${field.type})`);
    });

    console.log("\n=== Field Types ===");
    const fieldTypes = {};
    fields.forEach((field) => {
      fieldTypes[field.type] = (fieldTypes[field.type] || 0) + 1;
    });

    Object.entries(fieldTypes).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });

    console.log("\n=== Usage Instructions ===");
    console.log("1. Review the field names above");
    console.log(
      "2. Update the fieldMappings in pdfService.js to match your template"
    );
    console.log(
      "3. Test with a sample invoice to ensure all fields are filled correctly"
    );
  } catch (error) {
    console.error("Error analyzing template:", error);
  }
}

// Run the analysis
analyzeTemplate();
