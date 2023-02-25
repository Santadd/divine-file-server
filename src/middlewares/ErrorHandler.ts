import { NextFunction, Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";
import { ResponseUtil } from "../utils/Response";

export class ErrorHandler {
  static catchErrors(fn) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static handleErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log(err, "All errors");
    // if entity is not found (resource is not found)
    if (err instanceof EntityNotFoundError) {
      return ResponseUtil.sendError(
        res,
        "Item or page you are looking for does not exist",
        404,
        null
      );
    }

    // if filetype is not accepted
    if (err.message === "Invalid file type") {
      return ResponseUtil.sendError(res, "Invalid file type", 422, null);
    }

    // generic response
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}
