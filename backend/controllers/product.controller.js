import Product from "../models/product.model.js";
import mongoose from "mongoose";

// ✅ POST - Create a new product (Protected route)
export const createProduct = async (req, res) => {
  const { name, description, image, state } = req.body;

  if (!name || !description || !image || !state) {
    return res.status(400).json({ success: false, message: "Please fill all fields" });
  }

  if (!req.userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      image,
      state,
      user: req.userId, // Attach the user ID to the product
    });
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in creating Travel Log:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ GET all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in getting travel logs:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, image, state } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Travel log ID" });
  }

  try {
      const product = await Product.findById(id);

      if (!product) {
          return res.status(404).json({ success: false, message: "Travel log not found" });
      }

      // Check if the user is the owner of the product
      if (!product.user || product.user.toString() !== req.userId) {
          return res.status(403).json({ success: false, message: "You are not authorized to update this Travel log" });
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, description, image, state },
          { new: true } // Return the updated document
      );

      res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
      console.error("Error in updating Travel Log:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Travel Log ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Travel Log not found" });
    }

    
    // Check if the user is the owner of the product
    if (!product.user || product.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this Travel Log" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Travel Log deleted successfully" });
  } catch (error) {
    console.error("Error in deleting Travel Log:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getProduct = async (req, res) => {
    const { name, state, page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    try {
        const query = {};


        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        // Add state filter
        if (state) {
            query.state = state;
        }

        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.countDocuments(query);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No Travel Log found" });
        }

        res.status(200).json({
            success: true,
            data: products,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalItems: count,
        });
    } catch (error) {
        console.error("Error fetching Travel Logs:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

