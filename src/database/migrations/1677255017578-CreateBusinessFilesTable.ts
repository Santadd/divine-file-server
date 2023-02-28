import { MigrationInterface, QueryRunner, Table } from "typeorm"
import { DBTable } from "../../constants/DBTable";

export class CreateBusinessFilesTable1677255017578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: DBTable.BUSINESSFILES,
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isUnique: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                        isNullable: false,

                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "file",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "dateAdded",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false,
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(DBTable.BUSINESSFILES);
    }

}
