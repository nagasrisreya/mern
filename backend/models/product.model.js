import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    state: { type: String, required: true }, // Add state field
});

export default mongoose.model("Product", productSchema);