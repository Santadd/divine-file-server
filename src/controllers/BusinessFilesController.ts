import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";
import { UpdateFileDTO, UploadFileDTO } from "../dtos/BusinessFileDTO";
import { validate, validateOrReject } from "class-validator";
import { User } from "../database/entities/UserEntity";
import { Download } from "../database/entities/DownloadEntity";
import { downloadFileTemplate } from "../templates/downloadFileTemplate";
import { GeneralUtils } from "../utils/generalUtils";
import { MailService } from "../services/mailService";

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
    async uploadFile(req: Request, res: Response, next: NextFunction): Promise<Response> {
        // get the file data
        const fileData = req.body;
        // Get the file
        fileData.file = req.file?.filename

        // Create a dto
        const dto = new UploadFileDTO()
        Object.assign(dto, fileData);

        // perform validations
        await validateOrReject(dto);

        // if (errors.length > 0) {
        //     return ResponseUtil.sendError(res, "Invalid data", 422, errors);
        // }
        const repo = appDataSource.getRepository(BusinessFile);

        const businessFile = repo.create(fileData);
        await repo.save(businessFile)

        return ResponseUtil.sendResponse(res, "File uploaded successfully", businessFile)
    }

    // Update a file
    async updateFile(req: Request, res: Response, next: NextFunction) {
        // Get the id of the file
        const {id} = req.params;
        
        // Check if id exists
        const repo = appDataSource.getRepository(BusinessFile)
        const businessFile = await repo.findOneByOrFail({
            id: id,
        });

        // Get the data
        const fileData = req.body;

        // Create a dto
        const dto = new UpdateFileDTO()
        Object.assign(dto, fileData);
        dto.id = parseInt(id)

        // perform validations
        await validateOrReject(dto);

        // // return errors if there are
        // if (errors.length > 0) {
        //     return ResponseUtil.sendError(res, "Invalid data", 422, errors);
        // }

        // update the data
        repo.merge(businessFile, fileData);
        await repo.save(businessFile);

        return ResponseUtil.sendResponse(res, "File updated successfully", businessFile);
    }

    // Delete a file
    async deleteFile(req: Request, res: Response, next: NextFunction): Promise<Response> {

        // get file id from the request
        const {id} = req.params;
        const repo = appDataSource.getRepository(BusinessFile)
        // Check if file exists
        const businessFile = await repo.findOneByOrFail({
            id: id,
        });

        await repo.remove(businessFile);

        return ResponseUtil.sendResponse(res, "File deleted successfully", null);
        
    }

    // Download a file
    async downloadFile(req: Request, res: Response, next: NextFunction) {

        // get file id from the request
        const {id} = req.params;

        // Get the auth payload from the request
        const payload = req["tokenPayload"]
        const userId = payload["userId"]

        // Look up for user
        const userRepo = appDataSource.getRepository(User);
        const user = await userRepo.findOneBy({id: userId})
        if (!user) {
            return ResponseUtil.sendError(res, "User not found", 404, null)
        }
        
        // lookup for file
        const fileRepo = appDataSource.getRepository(BusinessFile)
        // Check if file exists
        const businessFile = await fileRepo.findOneByOrFail({
            id: id,
        });
        
        // Save file to downloads
        const downloadRepo = appDataSource.getRepository(Download);
        const download = downloadRepo.create({
            user: user,
            businessfile: businessFile
        })

        // Send File via email to user
        const htmlTemplate = downloadFileTemplate(user.email);

        MailService.sendMail({
            from: "divine.duah@amalitech.org",
            to: user.email,
            subject: "Requested File",
            html: htmlTemplate.html,
            attachments: [
                {filename: `${businessFile.file}`, path: `./uploads/businessfiles/${businessFile.file}`}
            ]
        });

        await downloadRepo.save(download);

        return ResponseUtil.sendResponse(res, "File has been sent successfully via email", null);
    }
}