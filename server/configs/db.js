import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false); // Fail fast instead of silently buffering

        mongoose.connection.on('connected', () => console.log("✅ Database Connected"));
        mongoose.connection.on('error', (err) => console.error("❌ DB Connection Error:", err));
        mongoose.connection.on('disconnected', () => console.warn("⚠️ DB Disconnected"));

        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
    } catch (error) {
        console.error("❌ Could not connect to MongoDB:", error.message);
        console.error("👉 Ensure your IP is whitelisted: https://www.mongodb.com/docs/atlas/security-whitelist/");
        throw error;
    }
};

export default connectDB;