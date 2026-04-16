import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    role: {type: String, enum: ["owner", "user", "admin"], default: 'user' },
    image: {type: String, default: ''},
    securityQuestion: {type: String, default: ''},
    securityAnswer: {type: String, default: ''},
    currentSessionId: {type: String, default: ''},
    lastFeedbackPromptedAt: {type: Date, default: null},
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User