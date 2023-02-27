import express from "express";
import { AuthController } from "../controllers/AuthController";
import { ErrorHandler } from "../middlewares/ErrorHandler";


// Create new instance of router
const router = express.Router()

// Create instance of auth Controller
const authController = new AuthController()

// Register route
router.post("/register", ErrorHandler.catchErrors(authController.register))
// Login route
router.post("/login", ErrorHandler.catchErrors(authController.login));




export default router