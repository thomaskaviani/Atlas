import {injectable} from "inversify";
import BoardGame from "../domain/boardgame";
import CollectionLine from "../domain/collection-line";
import Owner from "../domain/owner";
import {Op} from "sequelize";
import {LoggingService} from "./logging-service";
import {Logging} from "../atlas/logging";

@injectable()
export class GameService {

    async saveBoardGame(boardgame: string, players: number): Promise<BoardGame> {
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

    async saveOwner(owner: string): Promise<Owner> {
        try {
            LoggingService.logWithOwner(Logging.OWNER_SAVING, owner);

            return await Owner.create({
                username: owner
            });
        } catch (err) {
            LoggingService.logWithOwner(Logging.OWNER_SAVED_FAILED, owner);
            throw new Error();
        }
    }

    async saveCollectionLine(boardgame: string, owner: string): Promise<CollectionLine> {
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

    async deleteCollectionLine(boardgame: string, owner: string) {
        await CollectionLine.destroy({
            where: {
                boardGameName: boardgame,
                ownerUserName: owner
            }
          });
    }

    async retrieveOwner(owner: string): Promise<Owner | null> {
        try {
            LoggingService.logWithOwner(Logging.OWNER_RETRIEVING, owner);

            return await Owner.findByPk(owner);
        } catch (error) {
            LoggingService.logWithOwner(Logging.OWNER_RETRIEVAL_FAILED, owner);
            throw new Error();
        }
    }

    async retrieveBoardGame(boardgame: string): Promise<BoardGame | null> {
        try {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_RETRIEVING, boardgame);
            return await BoardGame.findByPk(boardgame);
        } catch (error) {
            LoggingService.logWithBoardgame(Logging.BOARDGAME_RETRIEVAL_FAILED, boardgame);
            throw new Error();
        }
    }

    async retrieveAllBoardGames(): Promise<BoardGame[] | null> {
        try {
            LoggingService.log(Logging.BOARDGAME_RETRIEVING);
            return await BoardGame.findAll();
        } catch (error) {
            LoggingService.log(Logging.BOARDGAME_RETRIEVAL_FAILED);
            throw new Error();
        }
    }

    async retrieveLinesForOwnerAndBoardGame(boardgame: string, owner: string): Promise<CollectionLine[] | null> {
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

    async retrieveLinesForBoardGame(boardgame: string): Promise<CollectionLine[] | null> {
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

    async retrieveLinesForOwner(owner: string): Promise<CollectionLine[] | null> {
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

    public async doesOwnerExists(username: string) {
        const owner: Owner = await this.retrieveOwner(username);
        return owner != undefined;
    }

    public async doesBoardGameExists(name: string) {
        const boardgame: BoardGame = await this.retrieveBoardGame(name);
        return boardgame != undefined;
    }

    public async doesOwnerHaveGame(boardgame: string, owner: string): Promise<boolean> {
        const collectionLines: CollectionLine[] = await this.retrieveLinesForOwnerAndBoardGame(boardgame, owner);
        return collectionLines.length > 0;
    }
}
