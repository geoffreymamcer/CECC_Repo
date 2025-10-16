import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats,
  reduceStock,
} from "../controllers/InventoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getProducts);
router.get("/stats", auth, getInventoryStats);
router.get("/:id", auth, getProductById);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.put("/:productId/reduce-stock", auth, reduceStock);

export default router;
