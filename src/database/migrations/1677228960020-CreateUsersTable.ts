import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { DBTable } from "../../constants/DBTable"
import { Role } from "../../constants/Role"

export class CreateUsersTable1677228960020 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: DBTable.USERS,
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        isUnique: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "int",
                        default: Role.USER,
                    },
                    {
                        name: "isVerified",
                        type: "boolean",
                        default: false
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DBTable.USERS);
    }

}
