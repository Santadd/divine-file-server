import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";
import { UploadFileDTO } from "../dtos/BusinessFileDTO";
import { validate } from "class-validator";

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
        // Get the file
        fileData.file = req.file?.filename

        // Create a dto
        const dto = new UploadFileDTO()
        Object.assign(dto, fileData);

        // perform validations
        const errors = await validate(dto);

        if (errors.length > 0) {
            return ResponseUtil.sendError(res, "Invalid data", 422, errors);
        }
        const repo = appDataSource.getRepository(BusinessFile);

        const businessFile = repo.create(fileData);
        await repo.save(businessFile)

        return ResponseUtil.sendResponse(res, "File uploaded successfully", businessFile)

    }

}