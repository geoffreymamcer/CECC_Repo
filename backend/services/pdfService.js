import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { getInvoiceHtml } from "./invoiceTemplate.js";
import fs from "fs"; // --- NEW ---
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getImageAsBase64(filePath) {
  try {
    const file = fs.readFileSync(filePath);
    return `data:image/png;base64,${Buffer.from(file).toString("base64")}`;
  } catch (error) {
    console.error("Could not read logo file for PDF:", error);
    return "";
  }
}

const generateInvoicePDF = async (invoiceData) => {
  let browser = null;
  try {
    // --- THE FIX ---
    const logoBase64 = getImageAsBase64(
      path.join(__dirname, "../../assets/clinic-logo.png")
    );

    // Pass the base64 logo to the template
    const htmlContent = getInvoiceHtml(invoiceData, logoBase64);

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: "13in",
      printBackground: true,
      margin: { top: "8mm", bottom: "8mm", left: "10mm", right: "10mm" },
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating Invoice PDF with Puppeteer:", error);
    if (browser) await browser.close();
    throw new Error("Could not generate Invoice PDF.");
  }
};

export default {
  generateInvoicePDF,
};
