import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { User } from "../database/entities/UserEntity";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";

export class UsersController {
    // Get users function
    async getUsers(req: Request, res: Response, next: NextFunction) {
        const builder = appDataSource.getRepository(User).createQueryBuilder().orderBy("id", "DESC");

        const {records: users, paginationInfo} = await Paginator.paginate(builder, req)
        return ResponseUtil.sendResponse(res, "Fetched users successfully", users, paginationInfo)
        
    }

    // Get a user function
    async getUser(req: Request, res: Response, next: NextFunction) {

        // get email from the request
        const {id} = req.params;
        const user = await appDataSource.getRepository(User).findOneByOrFail({
            id: id,
        });
        return ResponseUtil.sendResponse(res, "Fetched user successfully", user);
    }

}