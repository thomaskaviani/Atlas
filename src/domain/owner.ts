import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: "owner",
    timestamps: false
})
export default class Owner extends Model {

    @Column({
        type: DataType.STRING(255),
        primaryKey: true,
        field: "username"
    })
    username?: string;
}