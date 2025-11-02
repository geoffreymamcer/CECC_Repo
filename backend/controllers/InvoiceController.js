import Invoice from "../models/Invoice.js";
import Profile from "../models/Profile.js";
import SequenceCounter from "../models/SequenceCounter.js";
import pdfService from "../services/pdfService.js";
import Product from "../models/Inventory.js";

export const getTodaysRevenue = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const result = await Invoice.aggregate([
      {
        $match: {
          // Ensure this field matches your schema. `createdAt` is added by `timestamps: true`.
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
    // The variable is named 'error'
    // --- THIS IS THE FIX ---
    // Use the correct 'error' variable instead of 'f'.
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

export const createInvoice = async (req, res) => {
  try {
    const invoiceData = { ...req.body };
    if (req.user?._id) {
      invoiceData.createdBy = String(req.user._id);
    }
    const profile = await Profile.findById(invoiceData.patientId);
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for provided patientId" });
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

    // Create the invoice. We will NOT generate the PDF here.
    const invoice = await Invoice.create(invoiceData);

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res
      .status(500)
      .json({ message: error.message || "Error creating invoice" });
  }
};

async function generateAndSendInvoicePDF(res, invoice, disposition) {
  // --- NEW --- Fetch the creator's profile to get their name
  let creatorName = "N/A";
  if (invoice.createdBy) {
    try {
      const creatorProfile = await Profile.findById(invoice.createdBy).lean();
      if (creatorProfile) {
        creatorName = `${creatorProfile.firstName} ${creatorProfile.lastName}`;
      }
    } catch (e) {
      console.error("Could not fetch creator's name for PDF:", e);
    }
  }

  // Add the creator's name to the invoice object before sending it to the template
  const invoiceWithCreator = { ...invoice.toObject(), creatorName };

  const pdfBuffer = await pdfService.generateInvoicePDF(invoiceWithCreator);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `${disposition}; filename="invoice-${invoice.invoiceNumber}.pdf"`
  );
  res.send(pdfBuffer);
}

// --- PDF DOWNLOAD (ON-DEMAND) ---
export const downloadInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Security check can be added here if needed
    // if (req.user.role !== 'admin' && invoice.patientId !== req.user.id) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    const pdfBuffer = await pdfService.generateInvoicePDF(invoice);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    res.status(500).json({ message: "Error downloading invoice PDF" });
  }
};

// --- PDF VIEW (ON-DEMAND) ---
export const viewInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Security check can be added here if needed

    const pdfBuffer = await pdfService.generateInvoicePDF(invoice);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error viewing invoice PDF:", error);
    res.status(500).json({ message: "Error viewing invoice PDF" });
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

export const getRecentInvoices = async (req, res) => {
  try {
    const recentInvoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-pdfData");

    res.status(200).json(recentInvoices);
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching recent invoices",
    });
  }
};

export const getItemSalesDistribution = async (req, res) => {
  try {
    const salesData = await Invoice.aggregate([
      // 1. Deconstruct the items array
      { $unwind: "$items" },

      // 2. Group by the specific item name first to sum up its sales
      {
        $group: {
          _id: "$items.itemName",
          totalSales: { $sum: "$items.price" },
        },
      },

      // 3. Look up the product details from the 'inventories' collection
      {
        $lookup: {
          from: "inventories", // Double-check this is your actual collection name in MongoDB
          localField: "_id",
          foreignField: "productName",
          as: "productDetails",
        },
      },

      // 4. Group by the CATEGORY (productType), providing a fallback to the itemName
      {
        $group: {
          _id: {
            // Use the productType from the inventory if available,
            // otherwise, fall back to the original itemName from the invoice.
            $ifNull: [{ $first: "$productDetails.productType" }, "$_id"],
          },
          // Sum the sales for all items belonging to this category
          categorySales: { $sum: "$totalSales" },
        },
      },

      // 5. Format the final output
      {
        $project: {
          _id: 0,
          name: "$_id", // The category name (or fallback itemName)
          sales: "$categorySales",
        },
      },

      // 6. Sort by the highest sales
      { $sort: { sales: -1 } },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching item sales distribution:", error);
    res.status(500).json({ message: "Error fetching item sales distribution" });
  }
};

export const getSalesOverTime = async (req, res) => {
  try {
    const { timeFrame = "day" } = req.query;
    // --- THIS IS A CRITICAL FIX ---
    // Get the user's timezone from the request header if available, otherwise fallback.
    // The frontend will need to send this. Default to a common timezone.
    const timezone = req.header("X-User-Timezone") || "Asia/Manila";

    let startDate;
    let dateGroupFormat;

    const now = new Date();

    switch (timeFrame) {
      case "month":
        // Start from the first day of the month, 11 months ago.
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        dateGroupFormat = "%Y-%m"; // Group by year-month (e.g., "2025-10")
        break;

      case "week":
        // Start from 6 weeks ago (to get 7 distinct week numbers)
        startDate = new Date();
        startDate.setDate(now.getDate() - 6 * 7);
        dateGroupFormat = "%Y-%U"; // Group by year-week number (e.g., "2025-43")
        break;

      default: // 'day'
        // Start from 6 days ago
        startDate = new Date();
        startDate.setDate(now.getDate() - 6);
        dateGroupFormat = "%Y-%m-%d"; // Group by year-month-day (e.g., "2025-10-31")
        break;
    }

    const salesData = await Invoice.aggregate([
      // 1. Filter invoices to be within our desired date range
      {
        $match: {
          invoiceDate: { $gte: startDate },
        },
      },
      // 2. Group by the calculated date format, summing the total amount
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateGroupFormat,
              date: "$invoiceDate",
              timezone: timezone, // --- Timezone fix ---
            },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      // 3. Sort by the date group to ensure chronological order
      { $sort: { _id: 1 } },
    ]);

    const salesMap = salesData.reduce((acc, item) => {
      acc[item._id] = item.totalSales;
      return acc;
    }, {});

    res.status(200).json(salesMap);
  } catch (error) {
    console.error("Error fetching sales over time:", error);
    res.status(500).json({ message: "Error fetching sales data" });
  }
};

export const getSalesByAgeGroup = async (req, res) => {
  try {
    const salesByAge = await Invoice.aggregate([
      // Stage 1: Lookup patient details from the 'profiles' collection
      {
        $lookup: {
          from: "profiles", // The actual collection name for your Profile model
          localField: "patientId",
          foreignField: "_id", // In your Profile model, _id is the link
          as: "patientProfile",
        },
      },

      // Stage 2: Deconstruct the patientProfile array
      {
        $unwind: "$patientProfile",
      },

      // Stage 3: Group by the ageCategory from the patient's profile
      {
        $group: {
          _id: "$patientProfile.ageCategory", // Group by the ageCategory field
          totalSales: { $sum: "$totalAmount" },
        },
      },

      // Stage 4: Format the output
      {
        $project: {
          _id: 0,
          group: "$_id", // Rename _id to 'group'
          sales: "$totalSales",
        },
      },

      // Stage 5: Sort by the group name for consistent ordering
      {
        $sort: { group: 1 },
      },
    ]);

    // Filter out any results where the group is null or empty
    const filteredResults = salesByAge.filter((item) => item.group);

    res.status(200).json(filteredResults);
  } catch (error) {
    console.error("Error fetching sales by age group:", error);
    res.status(500).json({ message: "Error fetching sales by age group" });
  }
};

export const getSalesBreakdown = async (req, res) => {
  try {
    const breakdownData = await Invoice.aggregate([
      // 1. Deconstruct the items array from each invoice
      { $unwind: "$items" },

      // 2. Lookup the corresponding product details from the 'inventories' collection
      {
        $lookup: {
          from: "inventories",
          localField: "items.itemName",
          foreignField: "productName",
          as: "productDetails",
        },
      },

      // 3. Filter out any invoice items that didn't have a match in the inventory
      { $match: { productDetails: { $ne: [] } } },

      // 4. Deconstruct the productDetails array
      { $unwind: "$productDetails" },

      // 5. Group by the product's category (productType)
      {
        $group: {
          _id: "$productDetails.productType",
          // Sum the final sale price for each item in the group
          totalRevenue: { $sum: "$items.price" },
          // Sum the cost for each item (cost * quantity)
          totalCost: {
            $sum: { $multiply: ["$items.qty", "$productDetails.productCost"] },
          },
        },
      },

      // 6. Format the output
      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: "$totalRevenue",
          cost: "$totalCost",
        },
      },

      // 7. Sort by the highest revenue
      { $sort: { revenue: -1 } },
    ]);

    res.status(200).json(breakdownData);
  } catch (error) {
    console.error("Error fetching sales breakdown:", error);
    res.status(500).json({ message: "Error fetching sales breakdown data" });
  }
};

export const getSummaryCardStats = async (req, res) => {
  try {
    // This powerful aggregation calculates multiple stats in one go.
    const results = await Invoice.aggregate([
      {
        $facet: {
          // Pipeline 1: Calculate total revenue and count invoices
          totalStats: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalInvoices: { $sum: 1 },
              },
            },
          ],
          // Pipeline 2: Calculate total items sold
          totalItemsSold: [
            { $unwind: "$items" },
            {
              $group: {
                _id: null,
                totalItems: { $sum: "$items.qty" },
              },
            },
          ],
          // Pipeline 3: Count unique customers who have made a purchase
          totalCustomers: [
            { $group: { _id: "$patientId" } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // Extract the results from the aggregation pipelines
    const totalStats = results[0]?.totalStats[0] || {
      totalRevenue: 0,
      totalInvoices: 0,
    };
    const totalItemsSold = results[0]?.totalItemsSold[0]?.totalItems || 0;
    const totalCustomers = results[0]?.totalCustomers[0]?.count || 0;

    // Calculate Average Order Value, preventing division by zero
    const avgOrderValue =
      totalStats.totalInvoices > 0
        ? totalStats.totalRevenue / totalStats.totalInvoices
        : 0;

    // Send the compiled data to the frontend
    res.status(200).json({
      totalRevenue: totalStats.totalRevenue,
      avgOrderValue: avgOrderValue,
      itemsSold: totalItemsSold,
      totalCustomers: totalCustomers, // Replacing "Return Rate"
    });
  } catch (error) {
    console.error("Error fetching summary card stats:", error);
    res.status(500).json({ message: "Error fetching summary stats" });
  }
};
