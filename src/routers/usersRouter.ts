import express from "express";
import { UsersController } from "../controllers/UsersController";
import { ErrorHandler } from "../utils/ErrorHandler";

// create new instance of router
const router = express.Router();


// Create instance of the UserController

const usersController = new UsersController()

// Get users router
router.get("/", ErrorHandler.handleErrors(usersController.getUsers));
router.get("/:id", ErrorHandler.handleErrors(usersController.getUser));


export default router
