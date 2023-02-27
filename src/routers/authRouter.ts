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
// Confirm account
router.get("/emailconfirmation/:token", ErrorHandler.catchErrors(authController.verifyAccount))
// forgot password
router.post("/forgotpassword", ErrorHandler.catchErrors(authController.forgotPassword));
// verify reset password request
router.get("/reset_password_request/:token", 
ErrorHandler.catchErrors(authController.verifyPasswordResetRequest)
);
// Reset password
router.post("/reset_password", ErrorHandler.catchErrors(authController.resetPassword))



export default router