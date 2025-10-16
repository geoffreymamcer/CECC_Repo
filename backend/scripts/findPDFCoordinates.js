import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findPDFCoordinates() {
  try {
    console.log("🔍 PDF Coordinate Finder Tool");
    console.log(
      "This tool will help you find the correct coordinates for your invoice template.\n"
    );

    const templatePath = path.join(
      __dirname,
      "../AdminSideAssets/CECC INVOICE TEMPLATE.pdf"
    );

    if (!(await fs.pathExists(templatePath))) {
      console.error("❌ PDF template not found at:", templatePath);
      console.log(
        "Please make sure your CECC-INVOICE-TEMPLATE.pdf is in the AdminSideAssets folder."
      );
      return;
    }

    console.log("📄 Loading PDF template...");
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    const pages = pdfDoc.getPages();
    if (pages.length === 0) {
      console.error("❌ No pages found in PDF");
      return;
    }

    const page = pages[0];
    const { width, height } = page.getSize();

    console.log(`📏 PDF Dimensions: ${width} x ${height} points`);
    console.log(
      `📏 PDF Dimensions: ${(width / 72).toFixed(1)} x ${(height / 72).toFixed(
        1
      )} inches`
    );
    console.log(
      `📏 PDF Dimensions: ${(width / 2.83465).toFixed(1)} x ${(
        height / 2.83465
      ).toFixed(1)} mm\n`
    );

    // Add coordinate grid markers
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;

    // Add coordinate markers every 100 points
    for (let x = 0; x <= width; x += 100) {
      for (let y = 0; y <= height; y += 100) {
        page.drawText(`${x},${y}`, {
          x: x,
          y: y,
          size: fontSize,
          font,
          color: rgb(0.7, 0.7, 0.7),
        });
      }
    }

    // Add some test text at common invoice positions
    const testPositions = [
      { x: 100, y: height - 100, label: "Invoice Number Position" },
      { x: 100, y: height - 150, label: "Job Order Position" },
      { x: 100, y: height - 200, label: "Date Position" },
      { x: 100, y: height - 250, label: "Patient Name Position" },
      { x: 100, y: height - 300, label: "Patient Address Position" },
      { x: 100, y: height - 350, label: "Items Table Start" },
      { x: 100, y: height - 500, label: "Total Amount Position" },
      { x: 100, y: height - 550, label: "Notes Position" },
    ];

    testPositions.forEach((pos) => {
      page.drawText(pos.label, {
        x: pos.x,
        y: pos.y,
        size: 10,
        font,
        color: rgb(1, 0, 0), // Red text
      });

      // Add coordinate info
      page.drawText(`(${pos.x}, ${pos.y})`, {
        x: pos.x,
        y: pos.y - 15,
        size: 8,
        font,
        color: rgb(0, 0, 1), // Blue text
      });
    });

    // Save the marked PDF
    const outputPath = path.join(
      __dirname,
      "../AdminSideAssets/COORDINATE-TEST.pdf"
    );
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);

    console.log("✅ Coordinate test PDF created at:", outputPath);
    console.log("\n📋 Instructions:");
    console.log("1. Open the COORDINATE-TEST.pdf file");
    console.log("2. Look at the red labels and blue coordinates");
    console.log("3. Note the coordinates where you want each field to appear");
    console.log(
      "4. Update the textPositions object in pdfService.js with these coordinates"
    );
    console.log("\n💡 Tips:");
    console.log("- Coordinates start from bottom-left (0,0)");
    console.log("- Y increases upward, X increases rightward");
    console.log("- Common invoice layouts:");
    console.log("  • Header: y = height - 100 to height - 200");
    console.log("  • Patient info: y = height - 200 to height - 300");
    console.log("  • Items table: y = height - 300 to height - 500");
    console.log("  • Totals: y = height - 500 to height - 600");
    console.log("  • Notes: y = height - 600 to height - 700");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the tool
findPDFCoordinates();
