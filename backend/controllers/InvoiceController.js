import Invoice from "../models/Invoice.js";
import Profile from "../models/Profile.js";
import SequenceCounter from "../models/SequenceCounter.js";
import pdfService from "../services/pdfService.js";

// Get total revenue for today
export const getTodaysRevenue = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching today's revenue:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching today's revenue",
    });
  }
};

// Get invoices for logged-in patient
// Get invoices for logged-in patient
export const getPatientInvoices = async (req, res) => {
  try {
    console.log("Auth user:", req.user);

    // Get the user's ID - could be in different places
    const userId = req.user._id || req.user.userId;

    console.log("Looking for invoices with ID:", userId);

    // First get all invoices to see what's in the database
    const allInvoices = await Invoice.find({})
      .select("patientId invoiceNumber")
      .lean();

    console.log("All invoices in system:", allInvoices);

    // Try to find the user's profile
    const profile = await Profile.findOne({ _id: userId });
    console.log("Found profile:", profile);

    // Then get invoices matching either userId or profile._id
    const invoices = await Invoice.find({
      patientId: profile ? profile._id : userId,
    })
      .sort({ createdAt: -1 })
      .select("-pdfData");

    console.log("Found invoices for patient:", invoices);

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching patient invoices:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching patient invoices",
    });
  }
};

// Get an invoice PDF by ID
export const getInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }

    // Get all possible user IDs
    const userId = req.user._id || req.user.userId;
    const userPatientId = req.user.patientId;
    const possibleIds = [userId, userPatientId].filter(Boolean);

    // Check if the requesting user owns this invoice
    const isOwner = possibleIds.includes(invoice.patientId);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      console.log("Auth failed:", {
        invoicePatientId: invoice.patientId,
        userIds: possibleIds,
        userRole: req.user.role,
      });
      return res.status(403).json({
        status: "error",
        message: "Not authorized to view this invoice",
      });
    }

    if (!invoice.pdfData) {
      return res.status(404).json({
        status: "error",
        message: "PDF not found for this invoice",
      });
    }

    // Set response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
    );
    res.send(invoice.pdfData);
  } catch (error) {
    console.error("Error fetching invoice PDF:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching invoice PDF",
    });
  }
};

// Get all invoices for a patient (admin route)
export const getInvoicesByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const invoices = await Invoice.find({ patientId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-pdfData"); // Exclude the PDF data to reduce response size

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching invoices",
    });
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching invoice",
    });
  }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const invoiceData = { ...req.body };
    // Ensure createdBy is set from the authenticated user
    if (req.user && req.user._id) {
      invoiceData.createdBy = String(req.user._id);
    }
    // Auto-fill patient details from Profile
    if (!invoiceData.patientId) {
      return res.status(400).json({
        status: "error",
        message: "patientId is required",
      });
    }
    const profile = await Profile.findById(invoiceData.patientId);
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found for provided patientId",
      });
    }
    invoiceData.patientName = [
      profile.firstName,
      profile.middleName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ");
    invoiceData.patientAddress = profile.address || "";
    invoiceData.patientPhoneNumber =
      profile.contact || profile.phone_number || "";
    const invoice = await Invoice.create(invoiceData);

    // Generate PDF invoice
    try {
      console.log(
        "Starting PDF generation for invoice:",
        invoice.invoiceNumber
      );
      const pdfBytes = await pdfService.generateInvoicePDF(invoice);

      console.log("PDF generated, size:", pdfBytes.length, "bytes");

      // Convert Uint8Array to Buffer for MongoDB storage
      const pdfBuffer = Buffer.from(pdfBytes);
      console.log("Converted to Buffer, size:", pdfBuffer.length, "bytes");

      // Update invoice with PDF data
      invoice.pdfData = pdfBuffer;
      invoice.pdfGeneratedAt = new Date();
      await invoice.save();

      console.log(
        `PDF generated successfully for invoice ${invoice.invoiceNumber}`
      );
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
      console.error("PDF Error details:", {
        message: pdfError.message,
        stack: pdfError.stack,
      });
      // Don't fail the request if PDF generation fails
      // The invoice is still created successfully
    }

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating invoice",
    });
  }
};

// Update an invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    // Do not allow changing createdBy through update
    if (updateData.createdBy) {
      delete updateData.createdBy;
    }
    // Use findById first, assign, then save to trigger pre-validate hooks for totals
    const invoiceDoc = await Invoice.findById(id);
    if (!invoiceDoc) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }
    Object.assign(invoiceDoc, updateData);
    const invoice = await invoiceDoc.save();
    /* const invoice = await Invoice.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }); */
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating invoice",
    });
  }
};

// Delete an invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error deleting invoice",
    });
  }
};

// Download invoice PDF
export const downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }

    if (!invoice.pdfData) {
      return res.status(404).json({
        status: "error",
        message: "PDF not found for this invoice",
      });
    }

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
    );
    res.setHeader("Content-Length", invoice.pdfData.length);

    // Send the PDF data
    res.send(invoice.pdfData);
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error downloading invoice PDF",
    });
  }
};

// Helper
function formatDateKey(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

// Preview next numbers (no increment)
export const getNextInvoiceNumbers = async (req, res) => {
  try {
    const { date } = req.query; // expected YYYY-MM-DD or ISO
    const useDate = date ? new Date(date) : new Date();
    const dateKey = formatDateKey(useDate);

    const [inv, jo] = await Promise.all([
      SequenceCounter.findOne({ name: "invoice", dateKey }),
      SequenceCounter.findOne({ name: "joborder", dateKey }),
    ]);

    const nextInvSeq = String(((inv && inv.seq) || 0) + 1).padStart(4, "0");
    const nextJoSeq = String(((jo && jo.seq) || 0) + 1).padStart(4, "0");
    const yyyy = dateKey.slice(0, 4);
    const mmdd = dateKey.slice(4, 8);

    res.status(200).json({
      invoiceNumber: `${yyyy}-${mmdd}-${nextInvSeq}`,
      jobOrderNumber: `${yyyy}-${mmdd}-${nextJoSeq}`,
    });
  } catch (error) {
    console.error("Error getting next invoice numbers:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error getting next invoice numbers",
    });
  }
};

// Add this new function to your InvoiceController.js file

// Get recent invoices (for dashboard)
export const getRecentInvoices = async (req, res) => {
  try {
    const recentInvoices = await Invoice.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5) // Get only the top 5
      .select("-pdfData"); // Exclude PDF data for performance

    res.status(200).json(recentInvoices);
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching recent invoices",
    });
  }
};
