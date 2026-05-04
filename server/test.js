import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Car from "./models/Car.js";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const user = await User.findOne();
        if (!user) return console.log("No user found");
        console.log("Found user:", user._id);

        try {
            const _id = user._id;
            let bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
            
            bookings = bookings.filter(booking => booking.car !== null)
            
            console.log("Success. Bookings:", bookings.length);
            const jsonStr = JSON.stringify({success: true, bookings});
            console.log("JSON generated length:", jsonStr.length);
        } catch (error) {
            console.log("Caught Error:", error.message);
        }

        process.exit(0);
    } catch (e) {
        console.error("Fatal Error:", e);
        process.exit(1);
    }
}

run();
