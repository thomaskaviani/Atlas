import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: "boardgame",
    timestamps: false
})
export default class BoardGame extends Model {

    @Column({
        type: DataType.STRING(255),
        primaryKey: true,
        field: "boardgame_name"
    })
    name?: string;
    
    @Column({
        type: DataType.NUMBER,
        field: "players"
    })
    players?: number;
}