"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const messages_1 = require("../atlas/messages");
let CollectionLine = class CollectionLine extends sequelize_typescript_1.Model {
    static getCapitalizedBoardGameNames(collectionLines) {
        let boardGamesForOwner = [];
        collectionLines.forEach((collectionLine) => {
            boardGamesForOwner.push(messages_1.Messages.capitalize(collectionLine.boardGameName));
        });
        return boardGamesForOwner.sort();
    }
    static getOwners(collectionLines) {
        let ownersOfBoardgame = [];
        collectionLines.forEach((collectionLine) => {
            ownersOfBoardgame.push(collectionLine.ownerUserName);
        });
        return ownersOfBoardgame.sort();
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "boardgame_name",
        primaryKey: true,
    }),
    __metadata("design:type", String)
], CollectionLine.prototype, "boardGameName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "owner_username",
        primaryKey: true,
    }),
    __metadata("design:type", String)
], CollectionLine.prototype, "ownerUserName", void 0);
CollectionLine = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "collection_line",
        timestamps: false
    })
], CollectionLine);
exports.default = CollectionLine;
//# sourceMappingURL=collection-line.js.map