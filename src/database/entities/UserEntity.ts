import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";
import { Roles } from "../../constants/Roles";
import {hash} from "bcryptjs"
import { Download } from "./DownloadEntity";


@Entity(DBTable.USERS)
export class User {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({default: Roles.USER})
    role: number

    @Column({default: false})
    isVerified: boolean

    // Hash password before inserting into database
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

    @OneToMany(() => Download, (download) => download.user)
    downloads: Download[]

    toResponse(): Partial<User> {
        
        const userResponse = new User()
        userResponse.id = this.id
        userResponse.email = this.email
        userResponse.isVerified = this.isVerified
        userResponse.role = this.role

        return userResponse
    }
}