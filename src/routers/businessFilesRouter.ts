import express from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { BusinessFilesController } from "../controllers/BusinessFilesController";
import { FileUploader } from "../middlewares/FileUploader";

// create new instance of router
const router = express.Router();

// Create instance of the UserController

const filesController = new BusinessFilesController();

// Get files router
router.get("/", ErrorHandler.handleErrors(filesController.getFiles));
router.get("/:id", ErrorHandler.handleErrors(filesController.getFile));
// upload file
router.post(
  "/upload",
  FileUploader.upload("file", "businessfiles", 2 * 1024 * 1024),
  ErrorHandler.handleErrors(filesController.uploadFile)
);
// Update a file
router.put("/:id", ErrorHandler.handleErrors(filesController.updateFile))



export default router;
