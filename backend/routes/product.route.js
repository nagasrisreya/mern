import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/auth.js"; // Import authentication middleware

const router = express.Router();

// ✅ GET all products (Public route)
router.get("/", getProducts);

// ✅ POST - Create a new product (Protected route)
router.post("/", createProduct);

// ✅ PUT - Update a product (Protected route)
router.put("/:id", updateProduct);

// ✅ DELETE - Remove a product (Protected route)
router.delete("/:id", deleteProduct);

// ✅ GET - Search for products (Public route)
router.get("/search", getProduct);

export default router;