import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

import productRoute from './routes/product.route.js';
import authRoute from './routes/auth.js';
import locationRoute from './routes/locationRoutes.js';
import chatbotRoute from './routes/chatbot.route.js'; // ✅ Import chatbot route
dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/products', productRoute);
app.use('/api/auth', authRoute);
app.use('/api/v1/location', locationRoute);
app.use('/api/chat', chatbotRoute); // ✅ Add chatbot route

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is already in use. Trying port ${Number(PORT) + 1}...`);
        app.listen(Number(PORT) + 1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
