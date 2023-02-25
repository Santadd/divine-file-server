import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

// Images are handled by the FileUploader middleware
export class UploadFileDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    title: string

    @IsNotEmpty()
    @IsString()
    description: string
}