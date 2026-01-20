import Product from "../models/Inventory.js";
import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";

// Get products with pagination and filtering
export const getProducts = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;

    const searchQuery = search
      ? {
          $or: [
            { productName: { $regex: search, $options: "i" } },
            { productDescription: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // If page and limit are provided, use pagination.
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const total = await Product.countDocuments(searchQuery);
      const totalPages = Math.ceil(total / limitNum);

      const products = await Product.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean();

      return res.json({
        products,
        totalPages,
        currentPage: pageNum,
        totalProducts: total,
      });
    } else {
      // If no page and limit, fetch all products.
      const products = await Product.find(searchQuery)
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        products,
        totalPages: 1, // Only one page since we're fetching all
        currentPage: 1,
        totalProducts: products.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const {
    productName,
    productType,
    productDescription,
    productPrice,
    productCost,
    availableStocks,
    productImage,
    isPrescriptionTableRequired,
    tags, // Add tags to destructuring
  } = req.body;

  const stocksStatus = availableStocks < 10 ? "low" : "in stock";

  const newProduct = new Product({
    productName,
    productType,
    productDescription,
    productPrice,
    productCost,
    availableStocks,
    stocksStatus,
    productImage,
    isPrescriptionTableRequired,
    tags: tags || [], // Ensure tags are saved, default to empty array
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reduce stock quantity
export const reduceStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if we have enough stock
    if (product.availableStocks < quantity) {
      return res.status(400).json({
        message: "Not enough stock available",
        available: product.availableStocks,
        requested: quantity,
      });
    }

    // Update the stock
    const newStockLevel = product.availableStocks - quantity;

    // Determine the new stock status
    let newStockStatus = product.stocksStatus;
    if (newStockLevel === 0) {
      newStockStatus = "out of stock";
    } else if (newStockLevel <= 5) {
      // You can adjust this threshold
      newStockStatus = "low";
    } else {
      newStockStatus = "in stock";
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        availableStocks: newStockLevel,
        stocksStatus: newStockStatus,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error reducing stock:", error);
    res
      .status(500)
      .json({ message: "Error reducing stock", error: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { availableStocks } = req.body;
    if (availableStocks !== undefined) {
      req.body.stocksStatus = availableStocks < 10 ? "low" : "in stock";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, tags: req.body.tags || [] }, // Explicitly include tags
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory statistics
export const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockItems = await Product.countDocuments({
      stocksStatus: "low",
    });
    const allProducts = await Product.find();
    const totalValue = allProducts.reduce(
      (sum, p) => sum + p.productPrice * p.availableStocks,
      0
    );

    res.json({
      totalProducts,
      lowStockItems,
      totalValue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProductTypes = async (req, res) => {
  try {
    // .distinct() is a highly efficient MongoDB operation for this exact purpose
    const types = await Product.distinct("productType");
    res.json(types.sort()); // Sort them alphabetically for a clean dropdown
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([
      // 1. Sort by newest first (optional, ensures you get recent items)
      { $sort: { createdAt: -1 } },

      // 2. Group by productType and take the first document found
      {
        $group: {
          _id: "$productType",
          product: { $first: "$$ROOT" },
        },
      },

      // 3. Replace the root with the product document
      { $replaceRoot: { newRoot: "$product" } },

      // 4. (Optional) Limit the total number if you have too many categories
      { $limit: 6 },
    ]);

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get recommended products based on diagnosis
export const getRecommendedProducts = async (req, res) => {
  try {
    let patientId = req.user._id.toString();
    console.log(`[DEBUG] Initial Patient ID from Auth: ${patientId}`);
    
    // Attempt to resolve the correct Profile ID
    // Check if there is a Profile with this ID directly, or matching email
    // This bridges the gap between PatientAuth (ObjectId) and Profile (String ID)
    const profile = await import("../models/Profile.js").then(m => m.default.findOne({
        $or: [
            { _id: patientId }, 
            { email: req.user.email },
            { patientId: patientId }
        ]
    }));

    if (profile) {
        console.log(`[DEBUG] Resolved Profile ID: ${profile._id}`);
        patientId = profile._id;
    } else {
        console.log("[DEBUG] No linked Profile found. Using Auth ID.");
    }

    // 1. Find the latest diagnosis for this patient
    // Use the resolved patientId (which should match the format in DiagnosticAssessmentPlan)
    const latestDiagnosis = await DiagnosticAssessmentPlan.findOne({
      patientId: patientId,
    })
      .sort({ createdAt: -1 })
      .select("assessment.primaryImpression");

    console.log("[DEBUG] Latest Diagnosis Record:", latestDiagnosis);

    let diagnosis = latestDiagnosis?.assessment?.primaryImpression;
    let query = {};
    let recommendationReason = "";
    let products = [];

    if (diagnosis) {
      console.log(`[DEBUG] Raw Diagnosis String: "${diagnosis}"`);
      // Simple keyword matching: split diagnosis into words and search tags
      // Filter out common small words to improve matching quality
      // ALSO: clean punctuation (like "Primary:") to just "Primary"
      const diagnosisKeywords = diagnosis
        .split(/[\s,:]+/) // Split by space, comma, or colon
        .filter((w) => w.length > 3)
        .map((w) => new RegExp(w, "i"));

      console.log("[DEBUG] Generated Keywords Regex:", diagnosisKeywords);

      if (diagnosisKeywords.length > 0) {
        query = {
          tags: { $in: diagnosisKeywords },
        };
        recommendationReason = `Recommended based on your diagnosis: ${diagnosis}`;
        products = await Product.find(query).limit(6).lean();
        console.log(`[DEBUG] Products found by matching tags: ${products.length}`);
      }
    } else {
        console.log("[DEBUG] No diagnosis found for patient.");
    }

    // 4. Fallback if no matching products or no diagnosis
    if (products.length === 0) {
      console.log("[DEBUG] No specific matches. Trying 'general' fallback.");
      // Try finding products with "general" tag or "wellness"
      products = await Product.find({
        tags: { $in: [/general/i, /wellness/i] },
      })
        .limit(6)
        .lean();

      recommendationReason = diagnosis
        ? `We couldn't find specific products for ${diagnosis}, but here are some popular items.`
        : "Recommended for your general wellness.";

      // Second fallback: just top newest if specific fallback tags not found
      if (products.length === 0) {
        console.log("[DEBUG] No 'general' matches. Returning top featured.");
        products = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
        recommendationReason = "Top Featured Products";
      }
    }

    res.json({
      products,
      recommendationReason,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};
