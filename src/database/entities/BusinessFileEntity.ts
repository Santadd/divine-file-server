import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DBTable } from "../../constants/DBTable";


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

}