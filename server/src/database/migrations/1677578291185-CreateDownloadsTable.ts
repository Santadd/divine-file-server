import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"
import { DBTable } from "../../constants/DBTable"

export class CreateDownloadsTable1677578291185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: DBTable.DOWNLOADS,
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "businessfileId",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "userId",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "downloadDate",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKeys(
            DBTable.DOWNLOADS,
            [
                new TableForeignKey({
                    columnNames: ["businessfileId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DBTable.BUSINESSFILES,
                    onDelete: "SET NULL"
                }),

                new TableForeignKey({
                    columnNames: ["userId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: DBTable.USERS
                }),

            ]
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DBTable.DOWNLOADS)
    }

}
