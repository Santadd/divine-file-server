import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"
import { DBTable } from "../../constants/DBTable";

export class CreateEmailsTable1677611881427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: DBTable.EMAILS,
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        isUnique: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "recipientEmail",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "businessfileId",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "downloadId", 
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "sendDate",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKeys(
            DBTable.EMAILS,
            [
                new TableForeignKey({
                    columnNames: ["businessfileId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DBTable.BUSINESSFILES
                }),

                new TableForeignKey({
                    columnNames: ["downloadId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DBTable.DOWNLOADS,
                    onDelete: "CASCADE"
                })
            ]
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DBTable.EMAILS)
    }

}
