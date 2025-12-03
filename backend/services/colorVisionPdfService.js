import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLocalImageBase64 = (plateNumber) => {
  try {
    const assetsDir = path.join(__dirname, "..", "assets", "ishihara_plates");
    const filePath = path.join(assetsDir, `${plateNumber}.jpg`);

    if (fs.existsSync(filePath)) {
      const bitmap = fs.readFileSync(filePath);
      return `data:image/jpeg;base64,${bitmap.toString("base64")}`;
    } else {
      console.warn(`[PDF GEN] Image missing: ${filePath}`);
      return null;
    }
    // 2️⃣ END MODIFICATION
  } catch (error) {
    console.error(`Error reading image for plate ${plateNumber}:`, error);
    return null;
  }
};

export const generateIshiharaPDF = async (testData) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
           body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px solid #7F0000; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #7F0000; margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0; color: #666; }
          
          .meta-container { display: flex; justify-content: space-between; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e9ecef; }
          .meta-item { text-align: center; }
          .meta-label { font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; display: block; margin-bottom: 5px; }
          .meta-value { font-weight: bold; font-size: 16px; color: #222; }
          
          .diagnosis-box { text-align: center; background: linear-gradient(135deg, #7F0000 0%, #a00000 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 4px 10px rgba(127, 0, 0, 0.2); }
          .diagnosis-box h3 { margin: 0 0 10px; font-size: 14px; text-transform: uppercase; opacity: 0.9; }
          .diagnosis-box h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
          
          .section-title { font-size: 18px; border-left: 4px solid #7F0000; padding-left: 10px; margin-bottom: 20px; color: #444; }
          
            .plate-row { display: flex; align-items: flex-start; border-bottom: 1px solid #eee; padding: 15px 0; page-break-inside: avoid; }          
                
            .plate-row:last-child { border-bottom: none; }
          
          .col-id {  width: 50px; /* Reduced slightly to save space */
      font-weight: bold; 
      color: #7F0000; 
      padding-top: 10px;}
          
 .col-images { 
      display: flex; 
      gap: 15px; 
      /* INCREASED: 150px + 150px + 15px gap = 315px. We use 320px for safety. */
      width: 320px; 
      /* PREVENT SHRINKING: Ensures images stay full size */
      flex-shrink: 0; 
  }          .img-container { text-align: center; }
          .plate-img { width: 150px; height: 150px; object-fit: contain; border-radius: 50%; border: 1px solid #ddd; background: white; }
          .snapshot-img { width: 150px; height: 125px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .img-label { font-size: 9px; color: #999; margin-top: 4px; text-transform: uppercase; }
          
 .col-analysis { 
      flex: 1; 
      padding-left: 20px; /* Increased padding slightly for separation */
  }          
          .answer-row { margin-bottom: 6px; }
          .badge { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; vertical-align: middle; margin-left: 8px; }
          .badge-normal { background: #dcfce7; color: #166534; }
          .badge-incorrect { background: #fee2e2; color: #991b1b; }
          .badge-malingering { background: #fef3c7; color: #92400e; }
          
          .ai-reasoning { font-size: 12px; color: #555; background: #f8f9fa; padding: 8px; border-radius: 6px; font-style: italic; border-left: 2px solid #ddd; }
          .latency { font-size: 10px; color: #999; margin-top: 4px; text-align: right; }
          
          .footer { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 10px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Candelaria Eye Care Clinic</h1>
          <p>Ishihara Color Vision Test Report</p>
        </div>

        <div class="meta-container">
           <!-- ... Keep meta items ... -->
           <div><strong>Patient:</strong> ${testData.patientName}</div>
           <div><strong>Date:</strong> ${new Date(
             testData.testDate
           ).toLocaleDateString()}</div>
           <div><strong>Accuracy:</strong> ${testData.accuracy}%</div>
        </div>

        <div class="diagnosis-box">
          <h3>AI Diagnostic Result</h3>
          <h1>${testData.testResult}</h1>
        </div>

        <div class="section-title">Detailed Plate Analysis</div>
        
        <div class="plate-list">
          ${testData.plateResults
            .map((plate) => {
              const localImageBase64 = getLocalImageBase64(plate.plateNumber);
              const plateSrc =
                localImageBase64 || "https://placehold.co/100x100?text=Missing";

              return `
            <div class="plate-row">
              <div class="col-id">#${plate.plateNumber}</div>
              
              <div class="col-images">
                <div class="img-container">
                  <!-- 3️⃣ START MODIFICATION: Use the local source -->
                  <img src="${plateSrc}" class="plate-img" alt="Stimulus" />
                  <!-- 3️⃣ END MODIFICATION -->
                  <div class="img-label">Stimulus</div>
                </div>
                <div class="img-container">
                  ${
                    plate.userSnapshot
                      ? `<img src="${plate.userSnapshot}" class="snapshot-img" alt="User" />`
                      : `<div style="width:100px; height:75px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; color:#ccc; font-size:10px; border:1px solid #ddd;">No Capture</div>`
                  }
                  <div class="img-label">Reaction Capture</div>
                </div>
              </div>

              <div class="col-analysis">
                <div class="answer-row">
                  <span style="font-size: 12px; color: #666;">User Answer:</span>
                  <span style="font-weight: bold; font-size: 15px; margin-left: 5px;">"${
                    plate.userAnswer
                  }"</span>
                  <span class="badge ${
                    plate.evaluation === "Normal"
                      ? "badge-normal"
                      : "badge-incorrect"
                  }">
                    ${plate.evaluation}
                  </span>
                </div>
                
                <div class="ai-reasoning">
                  "${plate.reasoning || "No analysis available."}"
                </div>
                
                <div class="latency">
                  Response Time: ${
                    plate.responseTime ? plate.responseTime.toFixed(2) : "0"
                  }s
                </div>
              </div>
            </div>
          `;
            })
            .join("")}
        </div>

        <div class="footer">
        <p><strong>Disclaimer:</strong> This report is generated by an automated system for screening purposes only. 
          It does not constitute a formal medical diagnosis. Please consult a licensed ophthalmologist for clinical verification.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "30px", right: "30px" },
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error("PDF Service Error:", error);
    throw new Error("Failed to generate PDF document.");
  }
};
