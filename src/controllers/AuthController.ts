import { validateOrReject } from "class-validator";
import { Request, NextFunction, Response } from "express";
import { User } from "../database/entities/UserEntity";
import { appDataSource } from "../database/data-source";
import { ResponseUtil } from "../utils/Response";
import { MailService } from "../services/mailService";
import { verifyEmailTemplate } from "../templates/verifyEmailTemplate";
import { GeneralUtils } from "../utils/generalUtils";
import { ForgotPasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from "../dtos/AuthDTO";
import { compare, hash } from "bcryptjs";
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate";


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
                tokenType: "user_email_verify",
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

    // verify users account
    async verifyAccount(req: Request, res: Response, next: NextFunction) {
        // Get token from the request params
        const token = req.params.token;

        // Verify the token
        const payload = GeneralUtils.validateVerificationToken(token)

        // false token
        if (!payload) {
            return ResponseUtil.sendError(res, "Invalid or expired token", 401, null);
        }

        // Check for token Type
        if (payload["tokenType"] !== "user_email_verify" || !payload["userId"]) {
            return ResponseUtil.sendError(res, "Invalid Request", 403, null)
        }

        // Get the user
        const repo = appDataSource.getRepository(User)

        const user = await repo.findOneBy({
            id: payload["userId"]
        })

        if (!user) {
            return ResponseUtil.sendError(res, "User not found", 404, null)
        } 
        else if (user.isVerified) {
            return ResponseUtil.sendResponse(res, "User is already verified", null)
        }
        // change verified status
        user.isVerified = true
        await repo.save(user)

        return ResponseUtil.sendResponse(res, "Email confirmed successfully", user.toResponse())
    }

    // Forgot password
    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        // Get the email from the request data
        const {email} = req.body

        const dto = new ForgotPasswordDTO()
        dto.email = email

        // validate the data
        await validateOrReject(dto)

        // Lookup for user
        const repo = appDataSource.getRepository(User);
        // Check for user email
        const user = await repo.findOneBy({email: email});
        if (!user) {
            return ResponseUtil.sendError(res, "Invalid email address", 400, null)
        }
        // If user is not verified
        if (!user.isVerified) {
            return ResponseUtil.sendError(res, "Please confirm your account", 401, null)
        }

        // Generate token
        const token = GeneralUtils.generateVerificationToken(
            {
                userId: user.id,
                tokenType: "forgot_password",
            }
        )
        // Get password verificationUrl
        const reqOriginAddress = `${req.protocol}://${req.get('host')}`;
        const passwordVerificationUrl = `${reqOriginAddress}/api/auth/reset_password_request/${token}`
        // Create email template
        const htmlTemplate = resetPasswordTemplate(user.email, passwordVerificationUrl);
        

        // Send the email
        MailService.sendMail({
            from: "divine.duah@amalitech.org",
            to: user.email,
            subject: "Reset Password",
            html: htmlTemplate.html
        });

        return ResponseUtil.sendResponse(res, "An email with instructions to reset password has been sent", null)
    }

    // Verify Password Reset Request
    async verifyPasswordResetRequest(req: Request, res: Response, nex: NextFunction) {

        // Get token from the request params
        const token = req.params.token;

        // Verify the token
        const payload = GeneralUtils.validateVerificationToken(token)

        // false token
        if (!payload) {
            return ResponseUtil.sendError(res, "Invalid or expired token", 401, null);
        }

        // Check for token Type
        if (payload["tokenType"] !== "forgot_password" || !payload["userId"]) {
            return ResponseUtil.sendError(res, "Invalid Request", 403, null)
        }

        return ResponseUtil.sendResponse(res, "You can now reset the password", null)
    }

    // reset password
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        // Get the email and password from the form
        const {email, password} = req.body

        const dto = new ResetPasswordDTO();
        dto.email = email
        dto.password = password

        // Perform Validations
        await validateOrReject(dto);

        // Lookup for user
        const repo = appDataSource.getRepository(User);

        // Check for user email
        const user = await repo.findOneBy({email: email});
        if (!user) {
            return ResponseUtil.sendError(res, "Invalid email address", 400, null)
        }
        // If user is not verified
        if (!user.isVerified) {
            return ResponseUtil.sendError(res, "Please confirm your account", 401, null)
        }

        console.log(password, email, "I have them here");
        
        // Hash the new password
        const hashedPassword = await hash(password, 12);
        user.password = hashedPassword

        await repo.save(user)

        return ResponseUtil.sendResponse(res, "Password reset completed successfully", null)
    }
}