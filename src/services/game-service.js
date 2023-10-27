"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const inversify_1 = require("inversify");
const boardgame_1 = require("../domain/boardgame");
const collection_line_1 = require("../domain/collection-line");
const owner_1 = require("../domain/owner");
const sequelize_1 = require("sequelize");
const logging_service_1 = require("./logging-service");
const logging_1 = require("../atlas/logging");
let GameService = exports.GameService = class GameService {
    async saveBoardGame(boardgame, players) {
        try {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.BOARDGAME_SAVING, boardgame);
            return await boardgame_1.default.create({
                name: boardgame,
                players: players,
            });
        }
        catch (err) {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.BOARDGAME_SAVED_FAILED, boardgame);
            throw new Error();
        }
    }
    async saveOwner(owner) {
        try {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.OWNER_SAVING, owner);
            return await owner_1.default.create({
                username: owner
            });
        }
        catch (err) {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.OWNER_SAVED_FAILED, owner);
            throw new Error();
        }
    }
    async saveCollectionLine(boardgame, owner) {
        try {
            logging_service_1.LoggingService.logWithBoardgameAndOwner(logging_1.Logging.COLLECTION_LINE_CREATED_FAILED, boardgame, owner);
            return await collection_line_1.default.create({
                boardGameName: boardgame,
                ownerUserName: owner
            });
        }
        catch (err) {
            logging_service_1.LoggingService.logWithBoardgameAndOwner(logging_1.Logging.COLLECTION_LINE_CREATED_FAILED, boardgame, owner);
            throw new Error();
        }
    }
    deleteCollectionLine(boardgame, owner) {
        this.retrieveLinesForOwnerAndBoardGame(owner, boardgame).then((collectionLines) => {
            collectionLines.forEach(collectionLine => {
                collectionLine.destroy().then(x => logging_service_1.LoggingService.logWithBoardgameAndOwner(logging_1.Logging.COLLECTION_LINE_DELETED, boardgame, owner));
            });
        });
    }
    async retrieveOwner(owner) {
        try {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.OWNER_RETRIEVING, owner);
            return await owner_1.default.findByPk(owner);
        }
        catch (error) {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.OWNER_RETRIEVAL_FAILED, owner);
            throw new Error();
        }
    }
    async retrieveBoardGame(boardgame) {
        try {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.BOARDGAME_RETRIEVING, boardgame);
            return await boardgame_1.default.findByPk(boardgame);
        }
        catch (error) {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.BOARDGAME_RETRIEVAL_FAILED, boardgame);
            throw new Error();
        }
    }
    async retrieveAllBoardGames() {
        try {
            logging_service_1.LoggingService.log(logging_1.Logging.BOARDGAME_RETRIEVING);
            return await boardgame_1.default.findAll();
        }
        catch (error) {
            logging_service_1.LoggingService.log(logging_1.Logging.BOARDGAME_RETRIEVAL_FAILED);
            throw new Error();
        }
    }
    async retrieveLinesForOwnerAndBoardGame(boardgame, owner) {
        try {
            logging_service_1.LoggingService.logWithBoardgameAndOwner(logging_1.Logging.COLLECTION_LINE_RETRIEVING, boardgame, owner);
            let condition = {};
            condition.boardGameName = { [sequelize_1.Op.eq]: boardgame };
            condition.ownerUserName = { [sequelize_1.Op.eq]: owner };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            logging_service_1.LoggingService.logWithBoardgameAndOwner(logging_1.Logging.COLLECTION_LINE_RETRIEVAL_FAILED, boardgame, owner);
            throw new Error();
        }
    }
    async retrieveLinesForBoardGame(boardgame) {
        try {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.COLLECTION_LINE_RETRIEVING, boardgame);
            let condition = {};
            condition.boardGameName = { [sequelize_1.Op.eq]: boardgame };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            logging_service_1.LoggingService.logWithBoardgame(logging_1.Logging.COLLECTION_LINE_RETRIEVAL_FAILED, boardgame);
            throw new Error();
        }
    }
    async retrieveLinesForOwner(owner) {
        try {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.COLLECTION_LINE_RETRIEVING, owner);
            let condition = {};
            condition.ownerUserName = { [sequelize_1.Op.eq]: owner };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            logging_service_1.LoggingService.logWithOwner(logging_1.Logging.COLLECTION_LINE_RETRIEVAL_FAILED, owner);
            throw new Error();
        }
    }
    async doesOwnerExists(username) {
        const owner = await this.retrieveOwner(username);
        return owner != undefined;
    }
    async doesBoardGameExists(name) {
        const boardgame = await this.retrieveBoardGame(name);
        return boardgame != undefined;
    }
    async doesOwnerHaveGame(boardgame, owner) {
        const collectionLines = await this.retrieveLinesForOwnerAndBoardGame(boardgame, owner);
        return collectionLines.length > 0;
    }
};
exports.GameService = GameService = __decorate([
    (0, inversify_1.injectable)()
], GameService);
//# sourceMappingURL=game-service.js.map