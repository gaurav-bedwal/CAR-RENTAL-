import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configs/db.js";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Database Connection Check Middleware
const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database not connected. Please ensure your IP is whitelisted in MongoDB Atlas.",
            status: "disconnected"
        });
    }
    next();
};

// Initialize Express App
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // Define CLIENT_URL in your production .env
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res)=> res.send("Server is running"))

// Apply DB check to all API routes
app.use('/api', dbCheck)

app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 3000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        // Log but don't crash — server still serves requests
        console.error("⚠️ Server started WITHOUT database connection:", error.message);
    }
    // Only listen if NOT on Vercel
    if (!process.env.VERCEL) {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    }
};

startServer();

export default app;