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
var Atlas_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atlas = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const logging_service_1 = require("../services/logging-service");
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const messages_1 = require("./messages");
const game_service_1 = require("../services/game-service");
const collection_line_1 = require("../domain/collection-line");
const logging_1 = require("./logging");
let Atlas = exports.Atlas = Atlas_1 = class Atlas {
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
            logging_service_1.LoggingService.log(logging_1.Logging.ATLAS_INITIALIZED);
        });
    }
    retrieveAtlasChannel() {
        this.discordClient.channels.fetch(this.atlasChannelId).then((channel) => {
            logging_service_1.LoggingService.log(logging_1.Logging.ATLAS_CHANNEL_FOUND);
            this.atlasChannel = channel;
            this.updateAtlasMessage();
        });
    }
    listen() {
        logging_service_1.LoggingService.log(logging_1.Logging.ATLAS_LISTENING);
        this.discordClient.on('messageCreate', (message) => {
            if (this.isValidAtlasChannel()) {
                logging_service_1.LoggingService.logDiscordMessage(message);
                logging_service_1.LoggingService.log("*" + message.content + "*");
                this.handleDiscordMessage(message);
            }
        });
    }
    handleDiscordMessage(message) {
        Atlas_1.handleAtlasCommand(message);
        void this.handleAddGameCommand(message);
        void this.handleRemoveGameCommand(message);
        void this.handleOwnerCommand(message);
        void this.handleGamesCommand(message);
    }
    static handleAtlasCommand(message) {
        if (commands_1.Commands.isAtlasCommand(message)) {
            messages_1.Messages.replySilent(message, messages_1.Messages.ATLAS_MESSAGE);
        }
    }
    async handleRemoveGameCommand(message) {
        if (commands_1.Commands.isRemoveGameCommand(message) && this.isValidAtlasChannel()) {
            const boardgame = message.content.slice(12).toLowerCase();
            if (!boardgame) {
                messages_1.Messages.replySilent(message, messages_1.Messages.REMOVE_GAME_INCOMPLETE_COMMAND);
                return;
            }
            if (await this.gameService.doesOwnerHaveGame(boardgame, message.author.username)) {
                this.gameService.deleteCollectionLine(boardgame, message.author.username);
                this.updateAtlasMessage();
                messages_1.Messages.replySilent(message, messages_1.Messages.REMOVED_FROM_GAME + boardgame);
            }
            else {
                messages_1.Messages.replySilent(message, messages_1.Messages.DONT_OWN_GAME_MESSAGE + boardgame);
            }
        }
    }
    async handleAddGameCommand(message) {
        if (commands_1.Commands.isAddGameCommand(message) && this.isValidAtlasChannel()) {
            const gameString = message.content.slice(9).toLowerCase();
            if (!gameString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.ADD_GAME_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.gameService.doesOwnerExists(message.author.username)) {
                await this.gameService.saveOwner(message.author.username);
            }
            if (!await this.gameService.doesBoardGameExists(gameString)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAME_DOES_NOT_EXIST_ADD_NOW_MESSAGE);
                await this.gameService.saveBoardGame(gameString, 0);
            }
            if (!await this.gameService.doesOwnerHaveGame(gameString, message.author.username)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAME_ADD_OWNER_MESSAGE + gameString);
                await this.gameService.saveCollectionLine(gameString, message.author.username);
                this.updateAtlasMessage();
            }
        }
    }
    async handleOwnerCommand(message) {
        if (commands_1.Commands.isOwnersCommand(message)) {
            const boardgame = message.content.slice(8).toLowerCase();
            if (!boardgame) {
                messages_1.Messages.replySilent(message, messages_1.Messages.GAMES_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.gameService.doesBoardGameExists(boardgame)) {
                messages_1.Messages.replySilent(message, messages_1.Messages.bold(boardgame) + messages_1.Messages.GAME_DOES_NOT_EXIST_MESSAGE);
            }
            else {
                let collectionLinesForBoardGame = await this.gameService.retrieveLinesForBoardGame(boardgame);
                let ownerString = '';
                for (let owner of collection_line_1.default.getOwners(collectionLinesForBoardGame)) {
                    ownerString = ownerString + owner + "\n";
                }
                messages_1.Messages.replySilent(message, messages_1.Messages.bold(messages_1.Messages.capitalize(boardgame)) + messages_1.Messages.HAS_FOLLOWING_OWNERS + ownerString);
            }
        }
    }
    async handleGamesCommand(message) {
        if (commands_1.Commands.isGamesCommand(message)) {
            const ownerString = message.content.slice(7);
            if (!ownerString) {
                messages_1.Messages.replySilent(message, messages_1.Messages.OWNER_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.gameService.doesOwnerExists(ownerString)) {
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
            await messages.first()?.delete();
            const atlasMessage = await this.generateAtlasMessage();
            if (atlasMessage.length != 0) {
                await this.atlasChannel.send(atlasMessage);
            }
        });
    }
    isValidAtlasChannel() {
        return this.atlasChannel.messages != null;
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
            if (owners.length > 0) {
                boardgameMap.set(messages_1.Messages.capitalize(boardgame.name), owners);
            }
        }
        return '# The Collection 🎲🏰🧙‍♂️\n\n'
            + 'This is a collection of all the boardgames I know of. Feel free to add games by using A.T.L.A.S in other channels with the proper commands.\n'
            + 'You can always find out how to use A.T.L.A.S by typing **!atlas** \n\n'
            + messages_1.Messages.getBoardgameBoxes(boardgameMap) + "\n\n";
    }
};
exports.Atlas = Atlas = Atlas_1 = __decorate([
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