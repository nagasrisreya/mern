import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Full error stack:', error.stack);
        process.exit(1);
    }
};