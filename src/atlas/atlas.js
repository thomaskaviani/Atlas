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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atlas = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./../types");
const logging_service_1 = require("../services/logging-service");
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const messages_1 = require("./messages");
const game_service_1 = require("../services/game-service");
const collection_line_1 = require("../domain/collection-line");
let Atlas = exports.Atlas = class Atlas {
    constructor(client, token, channelId, dbHost, dbUser, dbPassword, dbPort, dbName, gameService) {
        this.discordClient = client;
        this.token = token;
        this.atlasChannelId = channelId;
        this.dbHost = dbHost;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbPort = dbPort;
        this.dbName = dbName;
        this.gameService = gameService;
    }
    run() {
        this.initializeAtlas();
        this.listen();
        return this.discordClient.login(this.token);
    }
    //Private methods
    initializeAtlas() {
        this.discordClient.on('ready', () => {
            this.retrieveAtlasChannel();
            logging_service_1.LoggingService.log('Atlas initialized');
        });
    }
    retrieveAtlasChannel() {
        this.discordClient.channels.fetch(this.atlasChannelId).then((channel) => {
            logging_service_1.LoggingService.log('atlasChannel found');
            this.atlasChannel = channel;
            this.updateAtlasMessage();
        });
    }
    listen() {
        logging_service_1.LoggingService.log('Listening to messages');
        this.discordClient.on('messageCreate', (message) => {
            if (this.isValidAtlasChannel())
                logging_service_1.LoggingService.logDiscordMessage(message);
            logging_service_1.LoggingService.log("*" + message.content + "*");
            this.handleDiscordMessage(message);
        });
    }
    handleDiscordMessage(message) {
        this.handleAtlasCommand(message);
        this.handleAddGameCommand(message);
        this.handleRemoveGameCommand(message);
        this.handleOwnerCommand(message);
        this.handleGamesCommand(message);
    }
    handleAtlasCommand(message) {
        if (this.isAtlasCommand(message)) {
            messages_1.Messages.replySilent(message, messages_1.Messages.ATLAS_MESSAGE);
        }
    }
    async handleRemoveGameCommand(message) {
        if (this.isRemoveGameCommand(message) && this.isValidAtlasChannel()) {
            const gameString = message.content.slice(12).toLowerCase();
            if (!gameString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.REMOVE_GAME_INCOMPLETE_COMMAND);
                return;
            }
            if (await this.doesOwnerHaveGame(gameString, message.author.username)) {
                this.gameService.deleteCollectionLine(gameString, message.author.username);
                this.updateAtlasMessage();
                messages_1.Messages.replySilent(message, messages_1.Messages.REMOVED_FROM_GAME + gameString);
            }
            else {
                messages_1.Messages.replySilent(message, messages_1.Messages.DONT_OWN_GAME_MESSAGE + gameString);
            }
        }
    }
    async handleAddGameCommand(message) {
        if (this.isAddGameCommand(message) && this.isValidAtlasChannel()) {
            const gameString = message.content.slice(9).toLowerCase();
            if (!gameString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.ADD_GAME_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.doesOwnerExists(message.author.username)) {
                this.gameService.saveOwner(message.author.username);
            }
            if (!await this.doesBoardGameExists(gameString)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAME_DOES_NOT_EXIST_ADD_NOW_MESSAGE);
                this.gameService.saveBoardGame(gameString, 0);
            }
            if (!await this.doesOwnerHaveGame(gameString, message.author.username)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAME_ADD_OWNER_MESSAGE + gameString);
                this.gameService.saveCollectionLine(gameString, message.author.username);
                this.updateAtlasMessage();
            }
        }
    }
    async handleOwnerCommand(message) {
        if (this.isOwnersCommand(message)) {
            const gameString = message.content.slice(8).toLowerCase();
            if (!gameString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAMES_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.doesBoardGameExists(gameString)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAME_DOES_NOT_EXIST_MESSAGE);
            }
            else {
                let collectionLinesForBoardGame = await this.gameService.retrieveLinesForBoardGame(gameString);
                let ownerString = '';
                for (let ownerOfBoardgame of collection_line_1.default.getOwners(collectionLinesForBoardGame)) {
                    ownerString = ownerString + ownerOfBoardgame + "\n";
                }
                messages_1.Messages.replySilent(message, messages_1.Messages.bold(messages_1.Messages.capitalize(gameString)) + messages_1.Messages.HAS_FOLLOWING_OWNERS + ownerString);
            }
        }
    }
    async handleGamesCommand(message) {
        if (this.isGamesCommand(message)) {
            const ownerString = message.content.slice(7);
            if (!ownerString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.OWNER_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.doesOwnerExists(ownerString)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.USER_NOT_AN_OWNER_MESSAGE);
            }
            else {
                let collectionLinesForOwner = await this.gameService.retrieveLinesForOwner(ownerString);
                let boardgameString = '';
                for (let boardGame of collection_line_1.default.getCapitalizedBoardGameNames(collectionLinesForOwner)) {
                    boardgameString = boardgameString + boardGame + "\n";
                }
                messages_1.Messages.replySilent(message, messages_1.Messages.bold(ownerString) + messages_1.Messages.HAS_FOLLOWING_GAMES + boardgameString);
            }
        }
    }
    updateAtlasMessage() {
        this.atlasChannel.messages.fetch().then(async (messages) => {
            messages.first()?.delete();
            const atlasMessage = await this.generateAtlasMessage();
            if (atlasMessage.length != 0) {
                this.atlasChannel.send(atlasMessage);
            }
        });
    }
    async doesOwnerExists(username) {
        const owner = await this.gameService.retrieveOwner(username);
        return owner != undefined && owner != null;
    }
    async doesBoardGameExists(name) {
        const boardgame = await this.gameService.retrieveBoardGame(name);
        return boardgame != undefined && boardgame != null;
    }
    async doesOwnerHaveGame(gameString, username) {
        const collectionLines = await this.gameService.retrieveLinesForOwnerAndBoardGame(username, gameString);
        return collectionLines.length > 0;
    }
    isAtlasCommand(message) {
        return message.content.toLowerCase() == commands_1.Commands.ATLAS;
    }
    isAddGameCommand(message) {
        return message.content.toLowerCase().startsWith(commands_1.Commands.ADD_GAME) && message.content.slice(8).startsWith(' ');
    }
    isOwnersCommand(message) {
        return message.content.toLowerCase().startsWith(commands_1.Commands.OWNER) && message.content.slice(7).startsWith(' ');
    }
    isGamesCommand(message) {
        return message.content.toLowerCase().startsWith(commands_1.Commands.GAMES) && message.content.slice(6).startsWith(' ');
    }
    isRemoveGameCommand(message) {
        return message.content.toLowerCase().startsWith(commands_1.Commands.REMOVE_GAME) && message.content.slice(11).startsWith(' ');
    }
    isValidAtlasChannel() {
        return this.atlasChannel.messages != undefined && this.atlasChannel.messages != null;
    }
    async generateAtlasMessage() {
        let boardgameMap = new Map();
        let boardgames = await this.gameService.retrieveAllBoardGames();
        for (let boardgame of boardgames) {
            let collectionLinesForGame = await this.gameService.retrieveLinesForBoardGame(boardgame.name);
            let owners = [];
            for (let collectionLine of collectionLinesForGame) {
                owners.push(collectionLine.ownerUserName);
            }
            boardgameMap.set(messages_1.Messages.capitalize(boardgame.name), owners);
        }
        return '# The Collection 🎲🏰🧙‍♂️\n\n'
            + 'This is a collection of all the boardgames I know of. Feel free to add games by using A.T.L.A.S in other channels with the proper commands.\n'
            + 'You can always find out how to use A.T.L.A.S by typing **!atlas** \n\n'
            + messages_1.Messages.getBoardgameBoxes(boardgameMap) + "\n\n";
    }
};
exports.Atlas = Atlas = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Client)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.Token)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ChannelId)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.DBHost)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.DBUser)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.DBPassword)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.DBPort)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.DBName)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.GameService)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, String, String, String, String, String, String, game_service_1.GameService])
], Atlas);
//# sourceMappingURL=atlas.js.map