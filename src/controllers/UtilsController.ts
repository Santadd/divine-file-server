import { NextFunction, Request, Response } from "express";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { Paginator } from "../database/Paginator";
import { BusinessFile } from "../database/entities/BusinessFileEntity";

export class UtilsController {

    // Search for a file
    async searchFiles(req: Request, res: Response, next: NextFunction) {
        const query =  req.query.query as string
        // Check query length
        if (!query || query.length < 3) {
            return ResponseUtil.sendError(res, "Search query must be at least 3 characters", 400, null)
        }

        const queryBuilder = appDataSource.getRepository(BusinessFile).createQueryBuilder("businessfile")

        queryBuilder
          .where("LOWER(businessfile.title) LIKE LOWER(:tileQuery)", {
            tileQuery: `%${query}%`,
          })
          .orWhere("LOWER(businessfile.description) LIKE LOWER(:descQuery)", {
            descQuery: `%${query}%`,
          })
        
        const {records: searchResults, paginationInfo} = await Paginator.paginate(queryBuilder, req)

        return ResponseUtil.sendResponse(
            res,
            "Search successful",
            searchResults,
            paginationInfo
        );
    }
}