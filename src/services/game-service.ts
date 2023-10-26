import { injectable } from "inversify";
import BoardGame from "../domain/boardgame";
import CollectionLine from "../domain/collection-line";
import Owner from "../domain/owner";
import { Op } from "sequelize";

@injectable()
export class GameService {

  async saveBoardGame(name: string, players: number): Promise<BoardGame> { 
    try {
      return await BoardGame.create({
        name: name,
        players: players,
      });
    } catch (err) {
      throw new Error("Failed to create boardgame");
    }
  }

  async saveOwner(username: string): Promise<Owner> { 
      try {
          return await Owner.create({
            username: username
          });
        } catch (err) {
          throw new Error("Failed to create owner");
        }
  }

  async saveCollectionLine(name: string, username: string): Promise<CollectionLine> { 
      try {
          return await CollectionLine.create({
            boardGameName: name,
            ownerUserName: username
          });
        } catch (err) {
          throw new Error("Failed to create collectionline");
        }
  }

  deleteCollectionLine(name: string, username: string) {
    this.retrieveLinesForOwnerAndBoardGame(username, name).then((collectionLines: CollectionLine[]) => {
      collectionLines.forEach(collectionLine => {
        collectionLine.destroy();
      });
    });
  }

  async retrieveOwner(username: string): Promise<Owner | null> {
    try {
      return await Owner.findByPk(username);
    } catch (error) {
      throw new Error("Failed to retrieve owner");
    }
  }

  async retrieveBoardGame(name: string): Promise<BoardGame | null> {
    try {
      return await BoardGame.findByPk(name);
    } catch (error) {
      throw new Error("Failed to retrieve boardgame");
    }
  }

  async retrieveAllBoardGames(): Promise<BoardGame[] | null> {
    try {
      return await BoardGame.findAll();
    } catch (error) {
      throw new Error("Failed to retrieve boardgames");
    }
  }

  async retrieveLinesForOwnerAndBoardGame(username: string, boardgame: string): Promise<CollectionLine[]|null> {
      try {
          let condition: any = {};
          condition.boardGameName = { [Op.eq]: boardgame };
          condition.ownerUserName = { [Op.eq]: username };

          return await CollectionLine.findAll({ where: condition });
        } catch (error) {
          throw new Error("Failed to retrieve collectionlines");
        }
  }

  async retrieveLinesForBoardGame(boardgame: string): Promise<CollectionLine[]|null> {
    try {
        let condition: any = {};
        condition.boardGameName = { [Op.eq]: boardgame };

        return await CollectionLine.findAll({ where: condition });
      } catch (error) {
        throw new Error("Failed to retrieve collectionlines");
      }
  }

  async retrieveLinesForOwner(username: string): Promise<CollectionLine[]|null> {
    try {
        let condition: any = {};
        condition.ownerUserName = { [Op.eq]: username };

        return await CollectionLine.findAll({ where: condition });
      } catch (error) {
        throw new Error("Failed to retrieve collectionlines");
      }
  }

}
