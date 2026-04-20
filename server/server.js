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

// Start Server with Clustering for 500+ Concurrent Users
const startServer = async () => {
    const numCPUs = os.cpus().length;

    if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
        console.log(`🚀 Primary process ${process.pid} is running. Forking for ${numCPUs} CPUs...`);
        
        // Fork workers
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`⚠️ Worker ${worker.process.pid} died. Spawning a new one...`);
            cluster.fork();
        });
    } else {
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        const app = express();

        // Middleware
        app.use(cors({
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }));
        
        // In production, use simplified logging to save IO
        app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
        app.use(express.json({ limit: '10mb' })); // Increase for large payload if needed

        // --- Performance & Scaling Middleware ---
        // Note: compression, helmet, and rate-limit should be imported and used here 
        // if installed. Native clustering already provides the biggest boost.
        // ----------------------------------------

        // Routes
        app.get('/', (req, res)=> res.send(`Server running on worker ${process.pid}`))

        app.use('/api', dbCheck)
        app.use('/api/user', userRouter)
        app.use('/api/owner', ownerRouter)
        app.use('/api/bookings', bookingRouter)

        // Global Error Handler
        app.use((err, req, res, next) => {
            console.error(`[Worker ${process.pid}] Error:`, err.message);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        });

        const PORT = process.env.PORT || 3000;
        
        try {
            await connectDB();
            isConnected = true;
            app.listen(PORT, () => console.log(`✅ Worker ${process.pid} started on port ${PORT}`));
        } catch (error) {
            console.error(`❌ Worker ${process.pid} failed to connect to DB:`, error.message);
            // Listen anyway, dbCheck will retry
            app.listen(PORT, () => console.log(`⚠️ Worker ${process.pid} started WITHOUT DB on port ${PORT}`));
        }
    }
};

startServer();

export default {}; // Minimal export for clustering compatibility