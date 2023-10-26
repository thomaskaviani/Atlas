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
let GameService = exports.GameService = class GameService {
    async saveBoardGame(name, players) {
        try {
            return await boardgame_1.default.create({
                name: name,
                players: players,
            });
        }
        catch (err) {
            throw new Error("Failed to create boardgame");
        }
    }
    async saveOwner(username) {
        try {
            return await owner_1.default.create({
                username: username
            });
        }
        catch (err) {
            throw new Error("Failed to create owner");
        }
    }
    async saveCollectionLine(name, username) {
        try {
            return await collection_line_1.default.create({
                boardGameName: name,
                ownerUserName: username
            });
        }
        catch (err) {
            throw new Error("Failed to create collectionline");
        }
    }
    deleteCollectionLine(name, username) {
        this.retrieveLinesForOwnerAndBoardGame(username, name).then((collectionLines) => {
            collectionLines.forEach(collectionLine => {
                collectionLine.destroy();
            });
        });
    }
    async retrieveOwner(username) {
        try {
            return await owner_1.default.findByPk(username);
        }
        catch (error) {
            throw new Error("Failed to retrieve owner");
        }
    }
    async retrieveBoardGame(name) {
        try {
            return await boardgame_1.default.findByPk(name);
        }
        catch (error) {
            throw new Error("Failed to retrieve boardgame");
        }
    }
    async retrieveAllBoardGames() {
        try {
            return await boardgame_1.default.findAll();
        }
        catch (error) {
            throw new Error("Failed to retrieve boardgames");
        }
    }
    async retrieveLinesForOwnerAndBoardGame(username, boardgame) {
        try {
            let condition = {};
            condition.boardGameName = { [sequelize_1.Op.eq]: boardgame };
            condition.ownerUserName = { [sequelize_1.Op.eq]: username };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            throw new Error("Failed to retrieve collectionlines");
        }
    }
    async retrieveLinesForBoardGame(boardgame) {
        try {
            let condition = {};
            condition.boardGameName = { [sequelize_1.Op.eq]: boardgame };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            throw new Error("Failed to retrieve collectionlines");
        }
    }
    async retrieveLinesForOwner(username) {
        try {
            let condition = {};
            condition.ownerUserName = { [sequelize_1.Op.eq]: username };
            return await collection_line_1.default.findAll({ where: condition });
        }
        catch (error) {
            throw new Error("Failed to retrieve collectionlines");
        }
    }
};
exports.GameService = GameService = __decorate([
    (0, inversify_1.injectable)()
], GameService);
//# sourceMappingURL=game-service.js.map