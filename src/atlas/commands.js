"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
class Commands {
    static isAtlasCommand(message) {
        return message.content.toLowerCase() == Commands.ATLAS;
    }
    static isAddGameCommand(message) {
        return message.content.toLowerCase().startsWith(Commands.ADD_GAME) && message.content.slice(8).startsWith(' ');
    }
    static isOwnersCommand(message) {
        return message.content.toLowerCase().startsWith(Commands.OWNER) && message.content.slice(7).startsWith(' ');
    }
    static isGamesCommand(message) {
        return message.content.toLowerCase().startsWith(Commands.GAMES) && message.content.slice(6).startsWith(' ');
    }
    static isRemoveGameCommand(message) {
        return message.content.toLowerCase().startsWith(Commands.REMOVE_GAME) && message.content.slice(11).startsWith(' ');
    }
}
exports.Commands = Commands;
Commands.ATLAS = '!atlas';
Commands.ADD_GAME = '!addgame';
Commands.REMOVE_GAME = '!removegame';
Commands.OWNER = '!owners';
Commands.GAMES = '!games';
//# sourceMappingURL=commands.js.map