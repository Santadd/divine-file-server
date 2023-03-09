import express, {Express, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRouter from "./routers/usersRouter"
import filesRouter from "./routers/businessFilesRouter";
import authRouter from "./routers/authRouter";
import utilsRouter from "./routers/utilsRouter"
import { ErrorHandler } from "./middlewares/ErrorHandler";
import swaggerUI from "swagger-ui-express"
import * as swaggerDocument from "./swagger.json"

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
app.use("/api/auth", authRouter);
app.use("/api/search", utilsRouter);

// swwagger docs
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

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
