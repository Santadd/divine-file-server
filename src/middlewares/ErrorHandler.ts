import { NextFunction, Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";
import { ResponseUtil } from "../utils/Response";
import { ValidationError } from "class-validator";

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

    // call the format Errors
    if (err.length > 0 && err[0] instanceof ValidationError) {
      const errors = ErrorHandler.formatErrors(err);
      return ResponseUtil.sendError(res, "Invalid Input", 422, errors)
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

  // format errors
  static formatErrors(err: any) {
    const errors = {}
    err.forEach((e) => {
      if (!errors[e.property]) {
        errors[e.property] = [];
      }
      errors[e.property].push(e.constraints[Object.keys(e.constraints)[0]])
    });

    return errors;
  }
}
