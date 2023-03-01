import express from "express";
import { ErrorHandler } from "../middlewares/ErrorHandler";
import { BusinessFilesController } from "../controllers/BusinessFilesController";
import { FileUploader } from "../middlewares/FileUploader";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

// create new instance of router
const router = express.Router();

// Create instance of the UserController

const filesController = new BusinessFilesController();

// Get files router
router.get(
  "/",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(filesController.getFiles)
);
// get a file
router.get(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(filesController.getFile)
);
// upload file (post a file)
router.post(
  "/upload",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  FileUploader.upload("file", "businessfiles", 2 * 1024 * 1024),
  ErrorHandler.catchErrors(filesController.uploadFile)
);
// Update a file
router.put(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(filesController.updateFile)
);
// Delete a file
router.delete(
  "/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(filesController.deleteFile)
);
// Download a file
router.get(
  "/download/:id",
  ErrorHandler.catchErrors(AuthMiddleware.authenticate),
  ErrorHandler.catchErrors(filesController.downloadFile)
);
// Get file URL
router.get("/:documents/:id", ErrorHandler.catchErrors(filesController.getFileUrl));
// Get download details
router.get("/:id/download/details", ErrorHandler.catchErrors(filesController.downloadDetails))
// Get email details of a file
router.get("/:id/email/details", ErrorHandler.catchErrors(filesController.emailDetails))
// Get all details of a file (download and email details)
router.get("/:id/all/details", ErrorHandler.catchErrors(filesController.allDetails))




export default router;
