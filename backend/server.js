import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoute from './routes/product.route.js';

dotenv.config();

const app = express();


app.use(express.json());

// ✅ Connect to MongoDB before starting the server
connectDB();

// ✅ Use Product Routes
app.use('/api/products', productRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
