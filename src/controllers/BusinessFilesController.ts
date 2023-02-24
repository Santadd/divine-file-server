import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";

export class BusinessFilesController {
    // Get business files function
    async getFiles(req: Request, res: Response, next: NextFunction) {
        const builder = appDataSource.getRepository(BusinessFile).createQueryBuilder().orderBy("id", "DESC");

        const {records: businessFiles, paginationInfo} = await Paginator.paginate(builder, req)
        return ResponseUtil.sendResponse(res, "Fetched files successfully", businessFiles, paginationInfo)
        
    }

    // Get a file function
    async getFile(req: Request, res: Response, next: NextFunction) {

        // get file id from the request
        const {id} = req.params;
        const businessFile = await appDataSource.getRepository(BusinessFile).findOneByOrFail({
            id: id,
        });
        return ResponseUtil.sendResponse(res, "Fetched file successfully", businessFile);
    }

}