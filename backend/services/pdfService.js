import puppeteer from "puppeteer";
import { getInvoiceHtml } from "./invoiceTemplate.js";

const generateInvoicePDF = async (invoiceData) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Get the full HTML content from our new template
    const htmlContent = getInvoiceHtml(invoiceData);

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

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating Invoice PDF with Puppeteer:", error);
    if (browser) await browser.close();
    // Propagate the error so the controller can handle it
    throw new Error("Could not generate Invoice PDF.");
  }
};

export default {
  generateInvoicePDF,
};
