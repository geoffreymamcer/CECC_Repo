import pdfService from "../services/pdfService.js";

async function testInvoiceData() {
  try {
    console.log("🧪 Testing Invoice Data Mapping");

    // Simulate the invoice data that would come from your frontend
    const testInvoiceData = {
      invoiceNumber: "2025-0817-0012",
      jobOrderNumber: "JO-2025-001",
      invoiceDate: new Date(),
      patientId: "CECC25-0001",
      patientName: "John Doe",
      patientAddress: "123 Main Street, City, Province",
      patientTelephone: "555-1234",
      createdBy: "Admin User",
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      items: [
        {
          itemName: "Standard Frame",
          qty: 1,
          unitPrice: 120.0,
          discount: 0.0,
          isLens: false,
        },
        {
          itemName: "Single Vision Lens",
          qty: 1,
          unitPrice: 80.0,
          discount: 10.0,
          isLens: true,
          rightEye: { sph: "-2.50", cyl: "-1.00", axis: "90" },
          leftEye: { sph: "-2.25", cyl: "-0.75", axis: "85" },
          tint: "Clarity Green",
        },
      ],
      amountPaid: 50.0,
      notes: "Patient requested green tint for outdoor use.",
    };

    console.log("📋 Test Invoice Data:");
    console.log(JSON.stringify(testInvoiceData, null, 2));

    console.log("\n🔍 Testing PDF Generation...");
    const pdfBytes = await pdfService.generateInvoicePDF(testInvoiceData);

    console.log(`\n✅ PDF Generated Successfully!`);
    console.log(`📄 PDF Size: ${pdfBytes.length} bytes`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Run the test
testInvoiceData();
