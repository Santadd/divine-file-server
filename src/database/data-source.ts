import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";


// load the .env
dotenv.config()

// setup database connection
export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "pg1234",
    database: process.env.DB_DATABASE || "newfile",
    synchronize: false,
    logging: true,
    subscribers: [],
    entities: [],
})