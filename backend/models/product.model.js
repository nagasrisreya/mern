import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    state: { type: String, required: true }, // Add state field
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add user field

});

export default mongoose.model("Product", productSchema);