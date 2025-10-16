import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPDFGeneration() {
  try {
    console.log("Testing PDF generation...");

    // Create a simple test PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add some test text
    page.drawText("Test Invoice PDF", {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText("This is a test PDF to verify generation works", {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();

    // Save to file for testing
    const outputPath = path.join(__dirname, "../test-output.pdf");
    await fs.writeFile(outputPath, pdfBytes);

    console.log(
      `✅ PDF generated successfully! Size: ${pdfBytes.length} bytes`
    );
    console.log(`📁 Saved to: ${outputPath}`);

    return true;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    return false;
  }
}

// Test the PDF service
async function testPDFService() {
  try {
    console.log("\nTesting PDF Service...");

    // Import the service
    const pdfService = await import("../services/pdfService.js");

    // Test with mock data
    const mockInvoice = {
      invoiceNumber: "TEST-001",
      jobOrderNumber: "JO-001",
      invoiceDate: new Date(),
      patientName: "Test Patient",
      patientAddress: "Test Address",
      patientPhoneNumber: "123-456-7890",
      totalAmount: 150.0,
      notes: "Test invoice",
      items: [
        {
          itemName: "Test Item",
          qty: 1,
          unitPrice: 150.0,
          price: 150.0,
        },
      ],
    };

    console.log("Generating invoice PDF...");
    const pdfBytes = await pdfService.default.generateInvoicePDF(mockInvoice);

    console.log(`✅ Invoice PDF generated! Size: ${pdfBytes.length} bytes`);

    // Save for inspection
    const outputPath = path.join(__dirname, "../test-invoice.pdf");
    await fs.writeFile(outputPath, pdfBytes);
    console.log(`📁 Saved to: ${outputPath}`);

    return true;
  } catch (error) {
    console.error("❌ Error in PDF Service:", error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("🧪 Running PDF Generation Tests...\n");

  const basicTest = await testPDFGeneration();
  const serviceTest = await testPDFService();

  console.log("\n📊 Test Results:");
  console.log(`Basic PDF Generation: ${basicTest ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`PDF Service: ${serviceTest ? "✅ PASS" : "❌ FAIL"}`);

  if (basicTest && serviceTest) {
    console.log("\n🎉 All tests passed! PDF generation is working.");
  } else {
    console.log("\n⚠️  Some tests failed. Check the errors above.");
  }
}

runTests().catch(console.error);
