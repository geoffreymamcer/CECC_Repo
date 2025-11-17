import Product from "../models/Inventory.js";

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
    isPrescriptionTableRequired, // <-- Add this
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
      req.body,
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
