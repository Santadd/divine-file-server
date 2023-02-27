import { validateOrReject } from "class-validator";
import { Request, NextFunction, Response } from "express";
import { User } from "../database/entities/UserEntity";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { MailService } from "../services/mailService";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate";
import { GeneralUtils } from "../utils/generalUtils";
import { LoginDTO, RegisterDTO } from "../dtos/AuthDTO";
import { compare } from "bcryptjs";


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

    // Login users
    async login(req: Request, res: Response, next: NextFunction): Promise<Response> {
        // Get login data
        const {email, password} = req.body;

        const dto = new LoginDTO()
        dto.email = email;
        dto.password = password;

        // validate input
        await validateOrReject(dto)

        const repo = appDataSource.getRepository(User);
        // Check for user email
        const user = await repo.findOneBy({email});
        // if no user is found
        if (!user) {
            return ResponseUtil.sendError(res, "Invalid credentials. Please try again", 401, null)
        }
        // Password not matching
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return ResponseUtil.sendError(res, "Invalid credentials.", 401, null)
        }
        // Check for verification status
        if (!user.isVerified) {
            return ResponseUtil.sendError(res, "Please confirm your account and try again", 401, null)
        }

        const token = GeneralUtils.generateLoginToken(user)

        const response = {
            user: user.toResponse(),
            accessToken: token.accessToken,
        }

        return ResponseUtil.sendResponse(res, "Login successfull", response);
    }
}