import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage, updateCar, getFeedbacks, getClients, toggleUserStatus } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-car", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'rc', maxCount: 1 },
    { name: 'puc', maxCount: 1 },
    { name: 'insurance', maxCount: 1 }
]), protect, addCar)
ownerRouter.get("/cars", protect, getOwnerCars)
ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
ownerRouter.post("/update-car", protect, updateCar)
ownerRouter.post("/delete-car", protect, deleteCar)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage)
ownerRouter.get("/feedbacks", protect, getFeedbacks)
ownerRouter.get("/clients", protect, getClients)
ownerRouter.post("/toggle-freeze", protect, toggleUserStatus)

export default ownerRouter;