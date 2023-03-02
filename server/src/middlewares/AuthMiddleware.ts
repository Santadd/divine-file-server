import { NextFunction, Request, Response } from "express";
import { ResponseUtil } from "../utils/Response";
import { GeneralUtils } from "../utils/generalUtils";

export class AuthMiddleware {
    // function to authenticate users
    static async authenticate(req: Request, res: Response, next: NextFunction) {
        // Get token from headers
        try {
            const {authorization: tokenHeader} = req.headers;
            // Check for header (if none return error)
            if (!tokenHeader) {
                return ResponseUtil.sendError(res, "Token not provided", 401, null)
            }
            
            // Get the token and validate the token
            const token = tokenHeader.split(" ")[1];
            const payload = GeneralUtils.validateVerificationToken(token);

            // error for false token
            if (!payload) {
                return ResponseUtil.sendError(res, "Invalid or expired token", 401, null)
            }
            
            // Check for token Type
            if (payload["tokenType"] !== "user_access") {
                return ResponseUtil.sendError(res, "Invalid Authorization Header", 401, null)
            }
            // Get the payload from the token and add to request object
            req['tokenPayload'] = payload
        } 
        // Error in authorization header
        catch (error) {
            console.log(error);
            return ResponseUtil.sendError(res, "Invalid Authorization Header", 401, null)
        }
        // next function
        next();
    }
}