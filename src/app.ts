import express, {Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRouter from "./routers/usersRouter"
import filesRouter from "./routers/businessFilesRouter";
import { EntityNotFoundError } from "typeorm";
import { ResponseUtil } from "./utils/Response";
import { ErrorHandler } from "./middlewares/ErrorHandler";

const app: Express = express();

// region middlewares
app.use(cors());
app.use(bodyParser.json());
// add url encoded
app.use(bodyParser.urlencoded({extended: true}))

// end region middlewares

// region routes
app.use("/api/users", usersRouter);
app.use("/api/files", filesRouter);

// end region routes

// Handle requests not defined in any of the routes
app.use("*", (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: "The resource referenced in the URL was not found"
    })
});

// Define middleware function to handle Errors
app.use(ErrorHandler.handleErrors)


export default app;
