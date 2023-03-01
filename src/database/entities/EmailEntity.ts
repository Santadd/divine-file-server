import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { User } from "./UserEntity";
import { BusinessFile } from "./BusinessFileEntity";


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

    @CreateDateColumn()
    SendDate: Date

}