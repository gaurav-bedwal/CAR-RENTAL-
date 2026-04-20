import express from "express";
import { getCars, getPublicFeedback, getSecurityQuestion, getUserData, loginUser, registerUser, resetPassword, submitFeedback, skipFeedback, updateProfile, deleteAccount } from "../controllers/userController.js";
import { processChatMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/security-question', getSecurityQuestion)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/chat', processChatMessage)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.post('/submit-feedback', protect, submitFeedback)
userRouter.post('/skip-feedback', protect, skipFeedback)
userRouter.get('/public-feedback', getPublicFeedback)
userRouter.post('/update-profile', upload.single('image'), protect, updateProfile)
userRouter.delete('/delete-account', protect, deleteAccount)

export default userRouter;