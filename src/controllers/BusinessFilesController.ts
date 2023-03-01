import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";
import { UpdateFileDTO, UploadFileDTO } from "../dtos/BusinessFileDTO";
import { validateOrReject } from "class-validator";
import { User } from "../database/entities/UserEntity";
import { Download } from "../database/entities/DownloadEntity";
import { downloadFileTemplate } from "../templates/downloadFileTemplate";
import { MailService } from "../services/mailService";
import path from "path";
import fs from "fs";
import { Email } from "../database/entities/EmailEntity";

export class BusinessFilesController {
    // Get business files function
    async getFiles(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const builder = appDataSource.getRepository(BusinessFile).createQueryBuilder().orderBy("id", "DESC");

        const {records: businessFiles, paginationInfo} = await Paginator.paginate(builder, req)

        const fileData = businessFiles.map((file: BusinessFile) => {
            return file.toPayload(req)
        })
        return ResponseUtil.sendResponse(res, "Fetched files successfully", fileData, paginationInfo)
        
    }

    // Get a file function
    async getFile(req: Request, res: Response, next: NextFunction): Promise<Response> {

        // get file id from the request
        const {id} = req.params;
        const businessFile = await appDataSource.getRepository(BusinessFile).findOneByOrFail({
            id: id,
        });

        return ResponseUtil.sendResponse(res, "Fetched file successfully", businessFile.toPayload(req));
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

        return ResponseUtil.sendResponse(res, "File updated successfully", businessFile.toPayload(req));
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
        
        // Create download instance
        const downloadRepo = appDataSource.getRepository(Download);
        const download = downloadRepo.create({
            user: user,
            businessfile: businessFile
        })

        // Create Email Instance
        const emailRepo = appDataSource.getRepository(Email);
        const emailData = emailRepo.create({
            recipientEmail: user.email,
            businessfile: businessFile
        })
        
        // Start a transaction
        await appDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(download)
            await transactionalEntityManager.save(emailData)
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
        

        return ResponseUtil.sendResponse(res, "File has been sent successfully via email", null);
    }

    // Get file Url
    async getFileUrl(req: Request, res: Response, next: NextFunction) {
        // get the absolute url of the image

        // abc.com/api/files/{documents}/{id}
        const {documents, id} = req.params;
        const fileTypes = ["businessfiles"];
        // Check for correct filetype
        if (!fileTypes.includes(documents)) {
            return ResponseUtil.sendError(res, "File is Invalid", 500, null);
        }

        // Generate file path for the requested document
        let filepath = path.join(__dirname, "../../", "uploads", documents, id);

        if(!fs.existsSync(filepath)) {
            return ResponseUtil.sendError(res, "Document cannot not be found", 404, null);
        }

        // Get the extension of the file (Used to set appropriate header)
        const fileext = id.split(".")[1]

        try {
            fs.readFile(filepath, (err, data) => {

                if(err) {
                    return ResponseUtil.sendError(res, "Invalid file / file read error", 400, null);
                }
                // if no error set appropriate response header
                else if (fileext === "jpeg" || fileext === "jpg") {
                    res.set('Content-Type', 'image/jpeg')
                }
                else if (fileext === "png") {
                    res.set('Content-Type', 'image/png')
                }
                else if (fileext === "pdf") {
                    res.set('Content-Type', 'application/pdf')
                }
                else if (fileext === "doc") {
                    res.set('Content-Type', 'application/msword')
                }
                else if (fileext === "docx") {
                    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                }
                else {
                    return ResponseUtil.sendError(res, "Invalid File Type", 400, null);
                }
                res.send(data)
            })
        } 
        catch (error) {
            return ResponseUtil.sendError(res, "Bad request", 400, null);
        }
        

    }

    // Get download details of a file
    async downloadDetails(req: Request, res: Response, next: NextFunction) {

        // get file id from the request
        const {id} = req.params;
        const businessFileRepo = appDataSource.getRepository(BusinessFile)
        // Check if file exists
        const businessFile = await businessFileRepo.findOneByOrFail({
            id: id,
        });

        // Get the download repo and create a query builder
        const queryBuilder = appDataSource
          .getRepository(Download)
          .createQueryBuilder("download")
          .innerJoin("download.businessfile", "file")
          .select(["download", "file"])
          .where("download.businessfileId = :fileId", {fileId: businessFile.id})

        const {records: fileDetails, paginationInfo} = await Paginator.paginate(queryBuilder, req)


        return ResponseUtil.sendResponse(res, "Download data fetched successfully", fileDetails, paginationInfo)
    }

    // Get email details of a file
    async emailDetails(req: Request, res: Response, next: NextFunction) {

        // get file id from the request
        const {id} = req.params;
        const businessFileRepo = appDataSource.getRepository(BusinessFile)
        // Check if file exists
        const businessFile = await businessFileRepo.findOneByOrFail({
            id: id,
        });

        // Get the email repo and create a query builder
        const queryBuilder = appDataSource
          .getRepository(Email)
          .createQueryBuilder("email")
          .innerJoin("email.businessfile", "file")
          .select(["email", "file"])
          .where("email.businessfileId = :fileId", {fileId: businessFile.id})

        const {records: fileDetails, paginationInfo} = await Paginator.paginate(queryBuilder, req)


        return ResponseUtil.sendResponse(res, "Email data fetched successfully", fileDetails, paginationInfo)
    }
}