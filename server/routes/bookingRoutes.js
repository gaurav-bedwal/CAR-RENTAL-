import express from "express";
import { changeBookingStatus, checkAvailabilityOfCar, createRazorpayOrder, verifyRazorpayPayment, deleteBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.post('/create-order', protect, createRazorpayOrder)
bookingRouter.post('/verify-payment', protect, verifyRazorpayPayment)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookingStatus)
bookingRouter.post('/delete', protect, deleteBooking)

export default bookingRouter;