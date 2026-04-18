import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://gauravbedwal1105_db_user:12345@cluster0.jmupmpx.mongodb.net/car-rental';
        await mongoose.connect(uri);
        console.log("Connected to DB.");

        const hashedAdminPass = await bcrypt.hash('G@urav1234', 10);
        
        const result = await mongoose.connection.collection('users').updateOne(
            { role: 'admin' },
            { $set: { email: 'gauravbedwal1105@gmail.com', password: hashedAdminPass } },
            { upsert: true }
        );

        console.log("Reset result:", result);
        console.log("Admin credentials reset to -> Email: gauravbedwal1105@gmail.com | Password: G@urav1234");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();
