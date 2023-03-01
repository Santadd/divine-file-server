import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { User } from "./UserEntity";
import { BusinessFile } from "./BusinessFileEntity";
import { Download } from "./DownloadEntity";


// Junction Table (association Entity)
@Entity(DBTable.EMAILS)
export class Email {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @Column()
    // businessfileId: number

    // @Column()
    // userId: string

    @Column({nullable: false})
    recipientEmail: string

    @ManyToOne((type) => BusinessFile, (businessfile) => businessfile.emails)
    businessfile: BusinessFile

    @OneToOne((type) => Download, (download) => download.email)
    @JoinColumn()
    download: Download

    @CreateDateColumn()
    sendDate: Date

}