import jwt from "jsonwebtoken";
import { User } from "../database/entities/UserEntity";
import { Request} from "express";


export class GeneralUtils {

    // Generate confirmation token with payload and options as parameters
    // Payload contains data to be set as JWT Payload
    // Options contain jwt options
    static generateVerificationToken(payload: object, options: object={}) {

        // Get the secret key and expiration time in secs
        const secretKey: any = process.env.SECRET_ACCESS_KEY;
        const defaultOptions = {
            expiresIn: process.env.JWT_EXPIRATION_IN_SECS || '1h',
        }

        return jwt.sign(payload, secretKey, Object.assign(defaultOptions, options))
    }

    // validate verification token
    static validateVerificationToken(token: string) {
        try {
            const secretKey: any = process.env.SECRET_ACCESS_KEY
            return jwt.verify(token, secretKey)
        }
        catch(err) {
            console.log(err);
        }
        return false
    }

    // generate Login Token
    static generateLoginToken(user: User) {
        const accessToken = this.generateVerificationToken(
            {
                userId: user.id,
                tokenType: "user_access"
            }
        );
        return {
            accessToken: accessToken
        }
    }


    // Generate business file Url
    static businessFileUrl(req: Request, entityType: string, fileId: string) {
        const reqOriginAddress = `${req.protocol}://${req.hostname}:${process.env.APP_PORT}`
        
        return `${reqOriginAddress}/api/files/${entityType}/${fileId}`
    }
}