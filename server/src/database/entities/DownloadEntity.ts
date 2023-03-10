import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { User } from "./UserEntity";
import { BusinessFile } from "./BusinessFileEntity";
import { Email } from "./EmailEntity";


// Junction Table (association Entity)
@Entity(DBTable.DOWNLOADS)
export class Download {

    @PrimaryGeneratedColumn()
    id: string;

    // @Column()
    // businessfileId: number

    // @Column()
    // userId: string

    @ManyToOne((type) => User, (user) => user.downloads)
    user: User

    @ManyToOne((type) => BusinessFile, (businessfile) => businessfile.downloads)
    businessfile: BusinessFile

    @OneToOne((type) => Email, (email) => email.download)
    email: Email

    @CreateDateColumn()
    downloadDate: Date

}