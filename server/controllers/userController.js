import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import Feedback from "../models/Feedback.js";
import Booking from "../models/Booking.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import Otp from "../models/Otp.js";
import sendEmail from "../configs/nodemailer.js";


// Generate JWT Token
// Generate JWT Token with Session Tracking
const generateToken = (userId, sessionId)=>{
    const payload = { id: userId, sessionId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' })
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password, securityQuestion, securityAnswer, mobile, drivingLicense, otp} = req.body

        if(!name || !email || !password || !mobile || !drivingLicense || !otp || password.length < 8){
            return res.json({success: false, message: 'Fill all the mandatory fields (including OTP)'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        // Validate OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: 'Invalid or expired OTP' });
        }

        // Delete used OTP
        await Otp.deleteOne({ email });

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

// Send OTP
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (upsert)
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send Email
        const emailSubject = "Verify Your RentLux Account - OTP Verification";
        const emailText = `Your OTP for registering with RentLux is: ${otp}. This OTP is valid for 5 minutes.`;
        const emailHtml = `
            <div style="background-color: #0b0d17; color: #d1d5db; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; text-align: center; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); max-width: 600px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #fff;">
                        <span style="color: #d4af37; font-style: italic;">Rent</span>Lux
                    </span>
                </div>
                <hr style="border: 0; border-top: 1px solid rgba(212, 175, 55, 0.2); margin: 20px 0;" />
                <h2 style="color: #fff; font-size: 24px; font-weight: bold; margin-bottom: 10px;">Verification Code</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px;">
                    Thank you for choosing RentLux. Use the following security code to complete your client registration. This code is valid for <strong style="color: #fff;">5 minutes</strong>.
                </p>
                <div style="background-color: #141824; border: 1px solid #d4af37; border-radius: 16px; padding: 20px; display: inline-block; margin-bottom: 30px;">
                    <span style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #d4af37; font-family: monospace; display: block; padding-left: 8px;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #6b7280; line-height: 1.5;">
                    If you did not request this verification code, please ignore this email or contact support.
                </p>
                <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.05); margin: 30px 0 20px 0;" />
                <p style="font-size: 11px; color: #4b5563; text-transform: uppercase; tracking-spacing: 1px;">
                    &copy; 2026 RentLux. All Rights Reserved.
                </p>
            </div>
        `;

        const result = await sendEmail({
            to: email,
            subject: emailSubject,
            text: emailText,
            html: emailHtml
        });

        res.json({ success: true, message: "Verification code sent to your email successfully" });

    } catch (error) {
        console.error("Error in sendOtp:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body

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