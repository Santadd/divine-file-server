import { validateOrReject } from "class-validator";
import { Request, NextFunction, Response } from "express";
import { User } from "../database/entities/UserEntity";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { MailService } from "../services/mailService";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate";
import { GeneralUtils } from "../utils/generalUtils";
import { RegisterDTO } from "../dtos/AuthDTO";


export class AuthController {

    
    // Register users
    async register(req: Request, res: Response, next: NextFunction): Promise<Response> {
        // Get the registration data
        const registerData = req.body;
        const dto = new RegisterDTO();
        Object.assign(dto, registerData);

        // Validate the input
        await validateOrReject(dto);

        const repo = appDataSource.getRepository(User);
        const newUser = repo.create(registerData);
        const user = await repo.save(newUser);

        // Get the user ID and User Email
        // @ts-ignore
        const userId = user.id
        // @ts-ignore
        const userEmail = user.email

        // Generate token (requires payload and optional jwt params)
        const token = GeneralUtils.generateVerificationToken(
            {
                userId: userId, 
            }
        )

        // Get verificationUrl
        const reqOriginAddress = `${req.protocol}://${req.get('host')}`;
        const verificationUrl = `${reqOriginAddress}/api/auth/emailconfirmation/${token}`

        // Create email template
        const htmlTemplate = verifyEmailTemplate(userEmail, verificationUrl);

        // Send the email
        MailService.sendMail({
            from: "divine.duah@amalitech.org",
            to: userEmail,
            subject: "Confirm Your Account",
            html: htmlTemplate.html
        })

        return ResponseUtil.sendResponse(res, "User has been registered successfully", newUser)
    }
}