// backend/scripts/listTemplateFields.js
import pdfService from "../services/pdfService.js";

const run = async () => {
  const fields = await pdfService.getTemplateFields();
  console.log(fields);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
