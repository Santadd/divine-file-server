import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Download } from "./DownloadEntity";
import { GeneralUtils } from "../../utils/generalUtils";
import { Request} from "express";
import { type } from "os";
import { Email } from "./EmailEntity";


@Entity(DBTable.BUSINESSFILES)
export class BusinessFile {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true, nullable: false })
    title: string;

    @Column()
    description: string;

    @Column({nullable: false})
    file: string

    @CreateDateColumn()
    dateAdded: Date

    @OneToMany((type) => Download, (download) => download.businessfile)
    downloads: Download[]

    @OneToMany((type) => Email, (email) => email.businessfile)
    emails: Email[]

    toPayload(req: Request): Partial<BusinessFile> {
        
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            file: GeneralUtils.businessFileUrl(req, "businessfiles", this.file),
            dateAdded: this.dateAdded
        }
    }

}