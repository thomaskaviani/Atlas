import BoardGame from "../domain/BoardGame";
import {LoggingService} from "./LoggingService";
import {Logging} from "../utils/Logging";
import CollectionLine from "../domain/CollectionLine";
import {Op} from "sequelize";

export class BoardgameService {

    public static async retrieveBoardGame(boardgame: string): Promise<BoardGame | null> {
        try {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_RETRIEVING, boardgame);
            return await BoardGame.findByPk(boardgame);
        } catch (error) {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_RETRIEVAL_FAILED, boardgame);
            throw new Error();
        }
    }

    public static async retrieveAllBoardGames(): Promise<BoardGame[] | null> {
        try {
            LoggingService.log(Logging.BOARDGAME_RETRIEVING);
            return await BoardGame.findAll();
        } catch (error) {
            LoggingService.log(Logging.BOARDGAME_RETRIEVAL_FAILED);
            throw new Error();
        }
    }

    public static async retrieveLinesForOwnerAndBoardGame(boardgame: string, owner: string): Promise<CollectionLine[] | null> {
        try {
            LoggingService.logWithBoardgameAndOwner(Logging.COLLECTION_LINE_RETRIEVING, boardgame, owner);
            let condition: any = {};
            condition.boardGameName = {[Op.eq]: boardgame};
            condition.ownerUserName = {[Op.eq]: owner};

            return await CollectionLine.findAll({where: condition});
        } catch (error) {
            LoggingService.logWithBoardgameAndOwner(Logging.COLLECTION_LINE_RETRIEVAL_FAILED, boardgame, owner);
            throw new Error();
        }
    }

    public static async retrieveLinesForBoardGame(boardgame: string): Promise<CollectionLine[] | null> {
        try {
            LoggingService.logWithBoardgame(Logging.COLLECTION_LINE_RETRIEVING, boardgame);
            let condition: any = {};
            condition.boardGameName = {[Op.eq]: boardgame};

            return await CollectionLine.findAll({where: condition});
        } catch (error) {
            LoggingService.logWithBoardgame(Logging.COLLECTION_LINE_RETRIEVAL_FAILED, boardgame);
            throw new Error();
        }
    }

    public static async retrieveLinesForOwner(owner: string): Promise<CollectionLine[] | null> {
        try {
            LoggingService.logWithOwner(Logging.COLLECTION_LINE_RETRIEVING, owner);
            let condition: any = {};
            condition.ownerUserName = {[Op.eq]: owner};

            return await CollectionLine.findAll({where: condition});
        } catch (error) {
            LoggingService.logWithOwner(Logging.COLLECTION_LINE_RETRIEVAL_FAILED, owner);
            throw new Error();
        }
    }

    public static async saveBoardGame(boardgame: string, players: number): Promise<BoardGame> {
        try {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_SAVING, boardgame);

            return await BoardGame.create({
                name: boardgame,
                players: players,
            });
        } catch (err) {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_SAVED_FAILED, boardgame);
            throw new Error();
        }
    }

    public static async saveCollectionLine(boardgame: string, owner: string): Promise<CollectionLine> {
        try {
            LoggingService.logWithBoardgameAndOwner(Logging.COLLECTION_LINE_CREATING, boardgame, owner);
            return await CollectionLine.create({
                boardGameName: boardgame,
                ownerUserName: owner
            });
        } catch (err) {
            LoggingService.logWithBoardgameAndOwner(Logging.COLLECTION_LINE_CREATED_FAILED, boardgame, owner);
            throw new Error();
        }
    }

    public static async deleteCollectionLine(boardgame: string, owner: string) {
        await CollectionLine.destroy({
            where: {
                boardGameName: boardgame,
                ownerUserName: owner
            }
        });
    }

    public static async doesBoardGameExists(name: string) {
        const boardgame: BoardGame = await BoardgameService.retrieveBoardGame(name);
        return boardgame != undefined;
    }

    public static async doesOwnerHaveGame(boardgame: string, owner: string): Promise<boolean> {
        const collectionLines: CollectionLine[] = await BoardgameService.retrieveLinesForOwnerAndBoardGame(boardgame, owner);
        return collectionLines.length > 0;
    }
}