import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: "collection_line",
    timestamps: false
})
export default class CollectionLine extends Model {

    @Column({
        type: DataType.STRING(255),
        field: "boardgame_name",
        primaryKey: true,
    })
    boardGameName?: string;

    @Column({
        type: DataType.STRING(255),
        field: "owner_username",
        primaryKey: true,
    })
    ownerUserName?: string;
}