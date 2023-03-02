import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { User } from "../database/entities/UserEntity";
import { IsUnique } from "../validators/isUniqueValidator";


export class RegisterDTO {


    @IsNotEmpty()
    @IsEmail()
    @IsUnique(User, "email")
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    password: string;

    // TODO: fix confirm password
    // confirmPassword: string
}

export class LoginDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    password: string;
}

// Forgot password
export class ForgotPasswordDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

// Reset password
export class ResetPasswordDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    password: string;

    // TODO: fix confirm password
    // confirmPassword: string
}