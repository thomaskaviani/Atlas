import { Model, Table, Column, DataType } from "sequelize-typescript";
import { Messages } from "../atlas/messages";

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

    public static getCapitalizedBoardGameNames(collectionLines: CollectionLine[]): string[] {
        let boardGamesForOwner: string[] = [];
        collectionLines.forEach((collectionLine: CollectionLine) => {
          boardGamesForOwner.push(Messages.capitalize(collectionLine.boardGameName));
        });
        return boardGamesForOwner.sort();
    }

    public static getOwners(collectionLines: CollectionLine[]): string[] {
        let ownersOfBoardgame: string[] = [];
        collectionLines.forEach((collectionLine: CollectionLine) => {
            ownersOfBoardgame.push(collectionLine.ownerUserName);
        });
        return ownersOfBoardgame.sort();
    }

}