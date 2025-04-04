import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoute from './routes/product.route.js';
import authRoute from './routes/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB before starting the server
connectDB();

// Use Product Routes
app.use('/api/products', productRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is already in use. Trying port ${Number(PORT) + 1}...`);
                app.listen(Number(PORT) + 1);
            } else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();