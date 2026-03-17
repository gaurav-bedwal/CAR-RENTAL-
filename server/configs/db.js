import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("✅ Database Connected"));
        mongoose.connection.on('error', (err) => console.error("❌ DB Connection Error:", err));
        mongoose.connection.on('disconnected', () => console.warn("⚠️ DB Disconnected. Retrying..."));

        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
            serverSelectionTimeoutMS: 5000,
        });
    } catch (error) {
        console.error("❌ Could not connect to MongoDB:", error.message);
        console.error("👉 Check that your current IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/");
        throw error; // Re-throw so the caller can decide whether to crash
    }
};

export default connectDB;