import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "Session expired. Please log in again."})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded || !decoded.id){
            return res.json({success: false, message: "not authorized"})
        }

        const user = await User.findById(decoded.id).select("-password")
        
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }

        // Concurrent Session Check
        // If the sessionId in the token doesn't match the one in the DB, it means a newer login occurred elsewhere.
        if (user.currentSessionId && decoded.sessionId !== user.currentSessionId) {
            return res.json({success: false, message: "You have been logged in on another device. Please log in again to continue."})
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}