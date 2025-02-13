import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

// ✅ GET all products
router.get("/", getProducts);

// ✅ POST - Create a new product
router.post("/", createProduct);

// ✅ PUT - Update a product
router.put("/:id", updateProduct);

// ✅ DELETE - Remove a product
router.delete("/:id", deleteProduct);

export default router;
