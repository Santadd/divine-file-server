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
