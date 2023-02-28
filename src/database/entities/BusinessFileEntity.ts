import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Download } from "./DownloadEntity";


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

}