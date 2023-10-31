import BoardGame from "../domain/BoardGame";
import {LoggingService} from "./LoggingService";
import CollectionLine from "../domain/CollectionLine";
import {Op} from "sequelize";
import {ChatInputCommandInteraction} from "discord.js";

export class BoardgameService {

    public static async retrieveBoardGame(boardgame: string, interaction: ChatInputCommandInteraction): Promise<BoardGame | null> {
        try {
            return await BoardGame.findByPk(boardgame);
        } catch (err) {
            await LoggingService.logError(err, "retrieve-boardgame", interaction);
        }
    }

    public static async retrieveAllBoardGames(): Promise<BoardGame[] | null> {
        try {
            return await BoardGame.findAll();
        } catch (err) {
            await LoggingService.logError(err, "retrieve-boardgames", null);
        }
    }

    public static async retrieveLinesForOwnerAndBoardGame(boardgame: string, interaction: ChatInputCommandInteraction): Promise<CollectionLine[] | null> {
        try {
            let condition: any = {};
            condition.boardGameName = {[Op.eq]: boardgame};
            condition.ownerUserName = {[Op.eq]: interaction.user.username};

            return await CollectionLine.findAll({where: condition});
        } catch (err) {
            await LoggingService.logError(err, "retrieve-collection-line", interaction);
        }
    }

    public static async retrieveLinesForBoardGame(boardgame: string, interaction: ChatInputCommandInteraction): Promise<CollectionLine[] | null> {
        try {
            let condition: any = {};
            condition.boardGameName = {[Op.eq]: boardgame};

            return await CollectionLine.findAll({where: condition});
        } catch (err) {
            await LoggingService.logError(err, "retrieve-collection-line", interaction);
        }
    }

    public static async retrieveLinesForOwner(owner: string, interaction: ChatInputCommandInteraction): Promise<CollectionLine[] | null> {
        try {
            let condition: any = {};
            condition.ownerUserName = {[Op.eq]: owner};

            return await CollectionLine.findAll({where: condition});
        } catch (err) {
            await LoggingService.logError(err, "retrieve-collection-line", interaction);
        }
    }

    public static async saveBoardGame(boardgame: string, players: number, interaction: ChatInputCommandInteraction): Promise<BoardGame> {
        try {
            return await BoardGame.create({
                name: boardgame,
                players: players,
            });
        } catch (err) {
            await LoggingService.logError(err, "save-boardgame", interaction);
        }
    }

    public static async saveCollectionLine(boardgame: string, interaction: ChatInputCommandInteraction): Promise<CollectionLine> {
        try {
            return await CollectionLine.create({
                boardGameName: boardgame,
                ownerUserName: interaction.user.username
            });
        } catch (err) {
            await LoggingService.logError(err, "save-collection-line", interaction);
        }
    }

    public static async deleteCollectionLine(boardgame: string, interaction: ChatInputCommandInteraction) {
        try {
            await CollectionLine.destroy({
                where: {
                    boardGameName: boardgame,
                    ownerUserName: interaction.user.username
                }
            });
        } catch (err) {
            await LoggingService.logError(err, "delete-collection-line", interaction);
        }
    }

    public static async doesBoardGameExists(name: string, interaction: ChatInputCommandInteraction) {
        const boardgame: BoardGame = await BoardgameService.retrieveBoardGame(name, interaction);
        return boardgame != undefined;
    }

    public static async doesOwnerHaveGame(boardgame: string, interaction: ChatInputCommandInteraction): Promise<boolean> {
        const collectionLines: CollectionLine[] = await BoardgameService.retrieveLinesForOwnerAndBoardGame(boardgame, interaction);
        return collectionLines.length > 0;
    }
}