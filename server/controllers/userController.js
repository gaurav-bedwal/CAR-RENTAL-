import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import Feedback from "../models/Feedback.js";


// Generate JWT Token
// Generate JWT Token with Session Tracking
const generateToken = (userId, sessionId)=>{
    const payload = { id: userId, sessionId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' })
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password, securityQuestion, securityAnswer} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
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
            securityAnswer: processedAnswer
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
        if (email === 'admin@gmail.com') {
            let adminUser = await User.findOne({ email: 'admin@gmail.com' });
            if (!adminUser) {
                const hashedAdminPass = await bcrypt.hash('admin12345', 10);
                adminUser = await User.create({
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    password: hashedAdminPass,
                    role: 'admin'
                });
            } else if (password === 'admin12345') {
                // Force reset to default if they use the default password to log in
                const hashedAdminPass = await bcrypt.hash('admin12345', 10);
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

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
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

// Get High-Rated Feedbacks for Testimonials (Public)
export const getPublicFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ rating: { $gte: 4 } })
            .populate('user', 'name image')
            .sort({ createdAt: -1 })
            .limit(6);
            
        res.json({ success: true, feedbacks });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}