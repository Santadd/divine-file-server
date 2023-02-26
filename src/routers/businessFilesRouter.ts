import express from "express";
import { ErrorHandler } from "../middlewares/ErrorHandler";
import { BusinessFilesController } from "../controllers/BusinessFilesController";
import { FileUploader } from "../middlewares/FileUploader";

// create new instance of router
const router = express.Router();

// Create instance of the UserController

const filesController = new BusinessFilesController();

// Get files router
router.get("/", ErrorHandler.catchErrors(filesController.getFiles));
// get a file
router.get("/:id", ErrorHandler.catchErrors(filesController.getFile));
// upload file (post a file)
router.post(
  "/upload",
  FileUploader.upload("file", "businessfiles", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(filesController.uploadFile)
);
// Update a file
router.put("/:id", ErrorHandler.catchErrors(filesController.updateFile));
// Delete a file
router.delete("/:id", ErrorHandler.catchErrors(filesController.deleteFile));



export default router;
