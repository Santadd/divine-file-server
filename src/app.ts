import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import usersRouter from "./routers/usersRouter"

const app: Express = express();

// region middlewares
app.use(cors());
app.use(bodyParser.json());

// end region middlewares

// region routes
app.use("/api/users", usersRouter);

// end region routes

app.get("/hello", (req, res, next) => {
    return res.status(200).json({
        message: "Hello World"
    })
});


export default app;
