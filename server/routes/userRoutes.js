import express from "express";
import { getCars, getPublicFeedback, getSecurityQuestion, getUserData, loginUser, registerUser, resetPassword, submitFeedback, skipFeedback } from "../controllers/userController.js";
import { processChatMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

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

export default userRouter;