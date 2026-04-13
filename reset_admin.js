import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://gauravbedwal1105_db_user:12345@cluster0.jmupmpx.mongodb.net/car-rental';
        await mongoose.connect(uri);
        console.log("Connected to DB.");

        const hashedAdminPass = await bcrypt.hash('admin12345', 10);
        
        const result = await mongoose.connection.collection('users').updateOne(
            { email: 'admin@gmail.com' },
            { $set: { password: hashedAdminPass } }
        );

        console.log("Reset result:", result);
        console.log("Admin credentials reset to -> Email: admin@gmail.com | Password: admin12345");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();
