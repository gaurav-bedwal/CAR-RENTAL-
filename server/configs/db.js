import mongoose from "mongoose";

// Enable command buffering globally so operations wait for DB connection
mongoose.set('bufferCommands', true);
const connectDB = async () => {
  try {

    mongoose.connection.on('connected', () => console.log("✅ Database Connected"));
    mongoose.connection.on('error', (err) => console.error("❌ DB Connection Error:", err));
    mongoose.connection.on('disconnected', () => console.warn("⚠️ DB Disconnected"));

    // Connection options: increase server selection timeout and socket timeout
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 30000,
    };

    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, options);
  } catch (error) {
    console.error("❌ MONGODB CONNECTION ERROR:", error.message);
    console.error("👉 TROUBLESHOOTING STEP: Ensure your current IP is whitelisted in MongoDB Atlas (Network Access).");
    console.error("👉 Current URI:", process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':****@')); // Log URI safely
    throw error;
  }
};

export default connectDB;