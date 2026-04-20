import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({
    car: {type: ObjectId, ref: "Car", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending"},
    price: {type: Number, required: true}
},{timestamps: true})

// Performance Indexes for Scalability
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking