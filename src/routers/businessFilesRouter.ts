import express from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { BusinessFilesController } from "../controllers/BusinessFilesController";

// create new instance of router
const router = express.Router();


// Create instance of the UserController

const filesController = new BusinessFilesController()

// Get files router
router.get("/", ErrorHandler.handleErrors(filesController.getFiles));
router.get("/:id", ErrorHandler.handleErrors(filesController.getFile));


export default router
