import * as dotenv from "dotenv";
import app from "./app";
import { appDataSource } from "./database/data-source";


// load the .env
dotenv.config()


// create port 
const PORT = process.env.APP_PORT || 3000;

// Establish database connection
appDataSource.initialize().then(async () => {
    console.log("Database connection established successfully.");
}).catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})