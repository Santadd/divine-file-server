import * as dotenv from "dotenv";
import app from "./app";


// load the .env
dotenv.config()


// create port 
const PORT = process.env.APP_PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})