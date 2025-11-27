import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium"; // --- 2. IMPORT the chromium package ---
import { getInvoiceHtml } from "./invoiceTemplate.js";
import fs from "fs";
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
    let launchOptions = {};

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../assets/clinic-logo.png");
    const logoBase64 = getImageAsBase64(logoPath);
    const htmlContent = getInvoiceHtml(invoiceData, logoBase64);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: "13in",
      printBackground: true,
      margin: {
        top: "8mm",
        bottom: "8mm",
        left: "10mm",
        right: "10mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating Invoice PDF with Puppeteer:", error);
    throw new Error("Could not generate Invoice PDF.");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default {
  generateInvoicePDF,
};
