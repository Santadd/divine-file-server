import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";

export class BusinessFilesController {
    // Get business files function
    async getFiles(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const builder = appDataSource.getRepository(BusinessFile).createQueryBuilder().orderBy("id", "DESC");

        const {records: businessFiles, paginationInfo} = await Paginator.paginate(builder, req)
        return ResponseUtil.sendResponse(res, "Fetched files successfully", businessFiles, paginationInfo)
        
    }

    // Get a file function
    async getFile(req: Request, res: Response, next: NextFunction): Promise<Response> {

        // get file id from the request
        const {id} = req.params;
        const businessFile = await appDataSource.getRepository(BusinessFile).findOneByOrFail({
            id: id,
        });
        return ResponseUtil.sendResponse(res, "Fetched file successfully", businessFile);
    }

    // Upload a file
    async uploadFile(req: Request, res: Response, next: NextFunction) {
        // get the file data
        const fileData = req.body;

        console.log("This is the data", fileData)
        const repo = appDataSource.getRepository(BusinessFile);

        const businessFile = repo.create(fileData);
        console.log("This is business file entity", businessFile)
        await repo.save(businessFile)

        return ResponseUtil.sendResponse(res, "File uploaded successfully", businessFile)

    }

}