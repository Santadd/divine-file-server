import express from "express";
import { ErrorHandler } from "../middlewares/ErrorHandler";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UtilsController } from "../controllers/UtilsController";

// create new instance of router
const router = express.Router();

// Create instance of the UserController

const utilsController = new UtilsController();

// Search for files
router.get(
    "/",
    ErrorHandler.catchErrors(AuthMiddleware.authenticate), 
    ErrorHandler.catchErrors(utilsController.searchFiles)
  );



export default router