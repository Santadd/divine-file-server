import jwt from "jsonwebtoken";


export class GeneralUtils {

    // Generate vonfirmation token with payload and options as parameters
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
}