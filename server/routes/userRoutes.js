import express from "express";
import { getCars, getSecurityQuestion, getUserData, loginUser, registerUser, resetPassword } from "../controllers/userController.js";
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

export default userRouter;