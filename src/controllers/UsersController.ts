import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { User } from "../database/entities/UserEntity";

export class UsersController {
    // Get users function
    async getUsers(req: Request, res: Response, next: NextFunction) {
        const users = await appDataSource.getRepository(User).find();

        console.log(users, "I find them here")
        return res.status(200).json({
            success: true,
            message: "Fetched users successfully",
            data: users
        });
    }

    // Get a user function
    async getUser(req: Request, res: Response, next: NextFunction) {
        // get email from the request
        const {id} = req.params;
        const user = await appDataSource.getRepository(User).findOneByOrFail({
            id: id,
        });
        return res.status(200).json({
            success: true,
            message: "Fetched user successfully",
            data: user
        });
    }

}