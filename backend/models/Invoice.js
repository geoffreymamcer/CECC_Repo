import mongoose from "mongoose";
import SequenceCounter from "./SequenceCounter.js";

const prescriptionEyeSchema = new mongoose.Schema(
  {
    sph: { type: String, default: "" },
    cyl: { type: String, default: "" },
    axis: { type: String, default: "" },
    add: { type: String, default: "" },
    pd: { type: String, default: "" },
    monoPd: { type: String, default: "" },
    sh: { type: String, default: "" },
    bc: { type: String, default: "" },
    dia: { type: String, default: "" },
  },
  { _id: false }
);

const invoiceItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    price: { type: Number, min: 0, default: 0 },
    isLens: { type: Boolean, default: false },
    tint: { type: String, default: "" },
    rightEye: { type: prescriptionEyeSchema, default: {} },
    leftEye: { type: prescriptionEyeSchema, default: {} },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    jobOrderNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    createdBy: { type: String, ref: "User", required: true },

    patientId: { type: String, ref: "User", required: true },
    patientName: { type: String, required: true },
    patientAddress: { type: String, required: true },
    patientPhoneNumber: { type: String, required: true },

    deliveryDate: { type: Date },

    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Invoice must contain at least one item",
      },
    },

    totalAmount: { type: Number, min: 0, default: 0 },

    // PDF storage
    pdfData: { type: Buffer },
    pdfGeneratedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Helper to format date as year-date-time code: YYYYMMDD-HHmmssSSS
function formatDateKey(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// Auto-generate invoice/job numbers and auto-calculate item price and total amount
invoiceSchema.pre("validate", async function (next) {
  try {
    // Ensure invoiceDate exists before id generation
    if (!this.invoiceDate) {
      this.invoiceDate = new Date();
    }

    // Generate numbers on create if not provided
    if (this.isNew) {
      const dateKey = formatDateKey(this.invoiceDate); // YYYYMMDD
      // get next sequence for invoice
      const invoiceCounter = await SequenceCounter.findOneAndUpdate(
        { name: "invoice", dateKey },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const seqStr = String(invoiceCounter.seq).padStart(4, "0");
      if (!this.invoiceNumber) {
        // Format: YYYY-MMDD-####
        const yyyy = dateKey.slice(0, 4);
        const mmdd = dateKey.slice(4, 8);
        this.invoiceNumber = `${yyyy}-${mmdd}-${seqStr}`;
      }
      if (!this.jobOrderNumber) {
        // Separate counter for JO to avoid clashes, but same daily reset
        const joCounter = await SequenceCounter.findOneAndUpdate(
          { name: "joborder", dateKey },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const joSeqStr = String(joCounter.seq).padStart(4, "0");
        const yyyy = dateKey.slice(0, 4);
        const mmdd = dateKey.slice(4, 8);
        this.jobOrderNumber = `${yyyy}-${mmdd}-${joSeqStr}`;
      }
    }

    if (Array.isArray(this.items)) {
      let sum = 0;
      this.items = this.items.map((item) => {
        const quantity = Number(item.qty) || 0;
        const unit = Number(item.unitPrice) || 0;
        const less = Number(item.discount) || 0;
        const computed = Math.max(0, quantity * unit - less);
        return { ...(item.toObject?.() ?? item), price: computed };
      });
      for (const item of this.items) {
        sum += Number(item.price) || 0;
      }
      this.totalAmount = sum;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
