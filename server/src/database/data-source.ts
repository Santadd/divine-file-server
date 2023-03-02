import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1677228960020 } from "./migrations/1677228960020-CreateUsersTable";
import { User } from "./entities/UserEntity";
import { BusinessFile } from "./entities/BusinessFileEntity";
import { CreateBusinessFilesTable1677255017578 } from "./migrations/1677255017578-CreateBusinessFilesTable";
import { Download } from "./entities/DownloadEntity";
import { CreateDownloadsTable1677578291185 } from "./migrations/1677578291185-CreateDownloadsTable";
import { CreateEmailsTable1677611881427 } from "./migrations/1677611881427-CreateEmailsTable";
import { Email } from "./entities/EmailEntity";


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
    entities: [
        User,
        BusinessFile,
        Download,
        Email,
    ],
    migrations: [
        CreateUsersTable1677228960020,
        CreateBusinessFilesTable1677255017578,
        CreateDownloadsTable1677578291185,
        CreateEmailsTable1677611881427
    ]
})