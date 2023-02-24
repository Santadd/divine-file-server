import express from "express";
import { UsersController } from "../controllers/UsersController";

// create new instance of router
const router = express.Router();


// Create instance of the UserController

const usersController = new UsersController()

// Get users router
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);


export default router
