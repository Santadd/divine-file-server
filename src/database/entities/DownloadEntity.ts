import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { User } from "./UserEntity";
import { BusinessFile } from "./BusinessFileEntity";


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

    @CreateDateColumn()
    downloadDate: Date

}