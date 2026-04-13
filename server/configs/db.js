import mongoose from "mongoose";

// Enable command buffering globally so operations wait for DB connection
mongoose.set('bufferCommands', true);
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
      return; // Already connecting or connected
  }
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in Environment Variables.");
    return; // Don't try to connect, let dbCheck handle the status
  }
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

    // Robust URI handling: Only append DB name if not already present
    let connectionString = process.env.MONGODB_URI;
    if (!connectionString.includes('/car-rental')) {
        // If there's a query param (?), insert DB name before it
        if (connectionString.includes('?')) {
            connectionString = connectionString.replace('?', '/car-rental?');
        } else {
            // Ensure trailing slash or append
            connectionString = connectionString.endsWith('/') 
                ? `${connectionString}car-rental` 
                : `${connectionString}/car-rental`;
        }
    }

    await mongoose.connect(connectionString, options);
  } catch (error) {
    console.error("❌ MONGODB CONNECTION ERROR:", error.message);
    
    let advice = "Ensure your current IP is whitelisted (0.0.0.0/0) in MongoDB Atlas.";
    if (error.message.includes("Authentication failed")) {
        advice = "Incorrect Username or Password in MONGODB_URI.";
    } else if (error.message.includes("ENOTFOUND")) {
        advice = "Could not reach MongoDB. Check your MONGODB_URI for typos.";
    }

    console.error("👉 TROUBLESHOOTING STEP:", advice);
    throw error;
  }
};

export default connectDB;