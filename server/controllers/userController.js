import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import Feedback from "../models/Feedback.js";
import Booking from "../models/Booking.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";


// Generate JWT Token
// Generate JWT Token with Session Tracking
const generateToken = (userId, sessionId)=>{
    const payload = { id: userId, sessionId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' })
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password, securityQuestion, securityAnswer, mobile, drivingLicense} = req.body

        if(!name || !email || !password || !mobile || !drivingLicense || password.length < 8){
            return res.json({success: false, message: 'Fill all the mandatory fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        let processedAnswer = securityAnswer ? securityAnswer.toLowerCase().trim() : '';

        const user = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            securityQuestion: securityQuestion || '', 
            securityAnswer: processedAnswer,
            mobile,
            drivingLicense
        })
        const sessionId = Date.now().toString()
        user.currentSessionId = sessionId
        await user.save()

        const token = generateToken(user._id.toString(), sessionId)
        res.json({success: true, token, user})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body

        // --- Admin Seeding & Recovery Logic ---
        if (email === 'gauravbedwal1105@gmail.com') {
            let adminUser = await User.findOne({ email: 'gauravbedwal1105@gmail.com' });
            if (!adminUser) {
                const hashedAdminPass = await bcrypt.hash('G@urav1234', 10);
                adminUser = await User.create({
                    name: 'Admin',
                    email: 'gauravbedwal1105@gmail.com',
                    password: hashedAdminPass,
                    role: 'admin'
                });
            } else if (password === 'G@urav1234') {
                // Force reset to default if they use the default password to log in
                const hashedAdminPass = await bcrypt.hash('G@urav1234', 10);
                adminUser.password = hashedAdminPass;
                await adminUser.save();
            }
        }
        // ---------------------------


        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }

        if (user.isFrozen) {
            return res.json({ success: false, message: "Your account has been suspended by an administrator. Please contact support." });
        }
        // Unique Session Tracking
        const sessionId = Date.now().toString()
        user.currentSessionId = sessionId
        await user.save()

        const token = generateToken(user._id.toString(), sessionId)
        res.json({success: true, token, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Simple in-memory cache for high-traffic scalability
const cache = {
    cars: { data: null, expiresAt: 0 },
    feedback: { data: null, expiresAt: 0 }
};

// Get All Cars for the Frontend (Cached for 2 minutes to handle 500+ users)
export const getCars = async (req, res) => {
    try {
        const now = Date.now();
        if (cache.cars.data && cache.cars.expiresAt > now) {
            return res.json({ success: true, cars: cache.cars.data, cached: true });
        }

        const cars = await Car.find({ isAvaliable: true });
        
        // Update cache
        cache.cars.data = cars;
        cache.cars.expiresAt = now + (2 * 60 * 1000); // 2 minutes

        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Fetch security question for email
export const getSecurityQuestion = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!user.securityQuestion) {
            return res.json({ success: false, message: "No security question established for this account. Contact support."});
        }
        res.json({ success: true, securityQuestion: user.securityQuestion });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Forgot Password Flow
export const resetPassword = async (req, res) => {
    try {
        const { email, securityAnswer, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
            return res.json({ success: false, message: "Incorrect security answer" });
        }

        if (newPassword.length < 8) {
             return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password reset successfully. You can now log in." });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Submit Customer Feedback
export const submitFeedback = async (req, res) => {
    try {
        const { rating, message, tags } = req.body;
        const userId = req.user._id;

        if (!rating || !message) {
            return res.json({ success: false, message: "Rating and message are required" });
        }

        await Feedback.create({
            user: userId,
            rating,
            message,
            tags: tags || []
        });

        // Update the user's promptedAt timestamp so they aren't bothered again for 7 days
        req.user.lastFeedbackPromptedAt = new Date();
        await req.user.save();

        res.json({ success: true, message: "Thank you for your valuable feedback!" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Skip Feedback Prompt
export const skipFeedback = async (req, res) => {
    try {
        req.user.lastFeedbackPromptedAt = new Date();
        await req.user.save();
        res.json({ success: true, message: "Prompt skipped." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get High-Rated Feedbacks for Testimonials (Public) (Cached for 10 minutes)
export const getPublicFeedback = async (req, res) => {
    try {
        const now = Date.now();
        if (cache.feedback.data && cache.feedback.expiresAt > now) {
            return res.json({ success: true, feedbacks: cache.feedback.data, cached: true });
        }

        const feedbacks = await Feedback.find({ rating: { $gte: 4 } })
            .populate('user', 'name image')
            .sort({ createdAt: -1 })
            .limit(6);
            
        // Update cache
        cache.feedback.data = feedbacks;
        cache.feedback.expiresAt = now + (10 * 60 * 1000); // 10 minutes

        res.json({ success: true, feedbacks });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, mobile, drivingLicense } = req.body;
        const imageFile = req.file;

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        if (name) user.name = name;
        if (mobile) user.mobile = mobile;
        if (drivingLicense) user.drivingLicense = drivingLicense;

        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/users'
            });

            const optimizedImageUrl = imagekit.url({
                path : response.filePath,
                transformation : [
                    {width: '400'},
                    {quality: 'auto'},
                    {format: 'webp'}
                ]
            });
            user.image = optimizedImageUrl;
        }

        await user.save();
        res.json({ success: true, message: "Profile updated successfully", user: { name: user.name, mobile: user.mobile, drivingLicense: user.drivingLicense, image: user.image, email: user.email, role: user.role, createdAt: user.createdAt } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Change Password for Logged-in User
export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.json({ success: false, message: "Please provide both old and new passwords" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters" });
        }

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete User Account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Optional: Check for active bookings before allowing deletion
        const activeBooking = await Booking.findOne({ user: userId, status: { $in: ['pending', 'confirmed'] } });
        if (activeBooking) {
            return res.json({ success: false, message: "Cannot delete account with active or pending bookings. Please cancel them first." });
        }

        await User.findByIdAndDelete(userId);
        // Clear sessions/cookies would happen on frontend by removing token
        res.json({ success: true, message: "Account deleted successfully. We're sorry to see you go." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}