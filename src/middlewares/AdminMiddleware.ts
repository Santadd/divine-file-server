import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { User } from "../database/entities/UserEntity";
import { ResponseUtil } from "../utils/Response";
import { Roles } from "../constants/Roles";


export class AdminMiddleware {
    static async checkAdminStatus(req: Request, res: Response, next: NextFunction) {
        // get the payload from the request object
        const payload = req["tokenPayload"]
        const userId = payload["userId"]

        // Look up for user
        const userRepo = appDataSource.getRepository(User);
        const user = await userRepo.findOneBy({id: userId})
        if (!user) {
            return ResponseUtil.sendError(res, "User not found", 404, null)
        }

        // Check if user role is Admin
        if (user.role !== Roles.ADMIN) {
            return ResponseUtil.sendError(res, "Access forbidden", 403, null);
        }
        
        next();
    }
}