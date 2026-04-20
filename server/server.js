import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configs/db.js";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import cluster from "node:cluster";
import os from "node:os";

// Initialize Express App first (Required for Vercel export)
const app = express();

// Database Connection Check Middleware (Optimized for Scaling)
let isConnected = false;
const dbCheck = async (req, res, next) => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return next();
    }
    try {
        await connectDB();
        isConnected = true;
        next();
    } catch (error) {
        return res.status(503).json({
            success: false,
            message: "Database not connected. High traffic or network issue.",
            status: "disconnected"
        });
    }
};

// Global Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// In production, use simplified logging to save IO
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/', (req, res)=> res.send(`Server is running (Environment: ${process.env.VERCEL ? 'Vercel' : 'Local/VPS'})`))

app.use('/api', dbCheck)
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`Error:`, err.message);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// Start Server Logic (Clustering or Serverless)
const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    // Vercel handles scaling automatically so clustering is skipped
    if (process.env.VERCEL) {
        console.log("☁️ Deployment detected on Vercel. Clustering skipped.");
        return; 
    }

    // Local/VPS High-Traffic Clustering
    const numCPUs = os.cpus().length;

    if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
        console.log(`🚀 Primary process ${process.pid} is running. Forking for ${numCPUs} CPUs...`);
        for (let i = 0; i < numCPUs; i++) cluster.fork();
        cluster.on('exit', (worker) => {
            console.log(`⚠️ Worker ${worker.process.pid} died. Spawning a new one...`);
            cluster.fork();
        });
    } else {
        try {
            await connectDB();
            isConnected = true;
            app.listen(PORT, () => console.log(`✅ Server started on port ${PORT} (PID: ${process.pid})`));
        } catch (error) {
            console.error(`❌ Failed to connect to DB:`, error.message);
            app.listen(PORT, () => console.log(`⚠️ Server started WITHOUT DB on port ${PORT}`));
        }
    }
};

startServer();

// EXTREMELY IMPORTANT FOR VERCEL DEPLOYMENT
export default app;