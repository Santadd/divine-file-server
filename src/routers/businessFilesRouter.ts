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


export default router;
