import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { BusinessFile } from "../database/entities/BusinessFileEntity"
import { IsUnique } from "../validators/isUniqueValidator"

// Images are handled by the FileUploader middleware
export class UploadFileDTO {

    id?: number

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @IsUnique(BusinessFile, "title")
    title: string

    @IsNotEmpty()
    @IsString()
    description: string
}

// Update a file
export class UpdateFileDTO {

    id?: number

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @IsUnique(BusinessFile, "title")
    title: string

    @IsOptional()
    @IsString()
    description: string
}