import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { DBTable } from "../../constants/DBTable"
import { Roles } from "../../constants/Roles"

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
                        default: "uuid_generate_v4()",
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
                        default: Roles.USER,
                    },
                    {
                        name: "isVerified",
                        type: "boolean",
                        default: false
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DBTable.USERS);
    }

}
