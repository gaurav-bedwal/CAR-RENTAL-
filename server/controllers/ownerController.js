import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import fs from "fs";


// API to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        // With the new Admin logic, we might not want users to freely become owners.
        // We will repurpose this or disable it later, but for now we'll restrict it.
        return res.json({success: false, message: "Role changes are now managed by Admin."})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Car

export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        if (!req.body.carData) {
            return res.json({ success: false, message: "Missing car data" });
        }
        let car = JSON.parse(req.body.carData);
        let image = '';

        if (req.file) {
            const imageFile = req.file;
            const fileBuffer = fs.readFileSync(imageFile.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/cars'
            })
            image = imagekit.url({
                path: response.filePath,
                transformation: [{ width: '1280' }, { quality: 'auto' }, { format: 'webp' }]
            });
        } else if (car.image) {
            // Upload from URL to ImageKit for consistency and optimization
            try {
                const response = await imagekit.upload({
                    file: car.image, // ImageKit accepts URLs directly
                    fileName: `car_url_${Date.now()}.jpg`,
                    folder: '/cars'
                })
                image = imagekit.url({
                    path: response.filePath,
                    transformation: [{ width: '1280' }, { quality: 'auto' }, { format: 'webp' }]
                });
            } catch (err) {
                // If remote upload fails, fallback to direct URL but warn
                console.log("Remote upload failed, using direct URL:", err.message);
                image = car.image;
            }
        } else {
            return res.json({ success: false, message: "Please upload an image or provide a valid URL" });
        }
        const isAdmin = req.user.role === 'admin';
        
        await Car.create({
            ...car, 
            owner: _id, 
            image,
            threeSixtyImages: car.threeSixtyImages || [],
            isAvaliable: isAdmin, // Only immediately available if admin
            status: isAdmin ? 'approved' : 'pending' // Normal users are pending
        });

        res.json({success: true, message: isAdmin ? "Car Added" : "Car listing requested! Pending admin approval."})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Owner Cars (Now strictly Admin lists all requested/existing cars)
export const getOwnerCars = async (req, res)=>{
    try {
        if (req.user.role !== 'admin') {
             return res.json({ success: false, message: "Unauthorized. Admin only." });
        }
        const cars = await Car.find({}) // Admin sees all cars
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Update Car details
export const updateCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId, ...updateData } = req.body;
        
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Checking if user is admin
        if (req.user.role !== 'admin') {
            return res.json({ success: false, message: "Unauthorized. Admin only." });
        }

        // Apply updates
        if (updateData.brand) car.brand = updateData.brand;
        if (updateData.model) car.model = updateData.model;
        if (updateData.description) car.description = updateData.description;
        if (updateData.location) car.location = updateData.location;
        if (updateData.fuel_type) car.fuel_type = updateData.fuel_type;
        if (updateData.rtoDate) car.rtoDate = updateData.rtoDate;
        if (updateData.year) car.year = updateData.year;
        if (updateData.pricePerDay) car.pricePerDay = updateData.pricePerDay;
        if (updateData.pricePerHour) car.pricePerHour = updateData.pricePerHour;
        if (updateData.category) car.category = updateData.category;
        if (updateData.seating_capacity) car.seating_capacity = updateData.seating_capacity;
        if (updateData.transmission) car.transmission = updateData.transmission;
        if (updateData.features) car.features = updateData.features;
        if (updateData.threeSixtyImages) car.threeSixtyImages = updateData.threeSixtyImages;
        
        // Admin approving a car
        if (updateData.status) {
            car.status = updateData.status;
            if (car.status === 'approved') car.isAvaliable = true;
        }

        await car.save();

        res.json({ success: true, message: "Car details updated", car });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        if (req.user.role !== 'admin') return res.json({ success: false, message: "Unauthorized. Admin only." });
        
        const {carId} = req.body
        const car = await Car.findById(carId)

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        if (req.user.role !== 'admin') return res.json({ success: false, message: "Unauthorized. Admin only." });

        const {carId} = req.body
        await Car.findByIdAndDelete(carId);

        // Clean up orphaned bookings associated with the deleted car
        await Booking.deleteMany({ car: carId });

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'admin'){
            return res.json({ success: false, message: "Unauthorized. Admin only." });
        }

        const cars = await Car.find({}) // All cars
        let bookings = await Booking.find({}).populate('car').sort({ createdAt: -1 }); // All bookings

        // Filter out bookings where car might have been deleted (populated as null)
        bookings = bookings.filter(booking => booking.car !== null);

        const pendingBookings = await Booking.find({ status: "pending" })
        const completedBookings = await Booking.find({ status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + (booking.price || 0), 0)

        // Fetch recent feedbacks for dashboard
        const recentFeedbacks = await Feedback.find({}).populate('user', 'name email image').sort({createdAt: -1}).limit(5);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue,
            allCars: cars,
            recentFeedbacks
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}   

// Fetch all feedbacks
export const getFeedbacks = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.json({ success: false, message: "Unauthorized. Admin only." });
        
        const feedbacks = await Feedback.find({}).populate('user', 'name email image').sort({createdAt: -1});
        res.json({ success: true, feedbacks });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}