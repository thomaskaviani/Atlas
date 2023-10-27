"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
class LoggingService {
    static log(message) {
        console.log(Date.now() + ":" + message);
    }
    static logWithError(message, error) {
        console.log(Date.now() + ":" + message, error);
    }
    static logDiscordMessage(message) {
        console.log(Date.now() + ":" + 'received message:' + message.content + ' - ' + message.author.username);
    }
    static logWithBoardgameAndOwner(message, boardgame, owner) {
        console.log(Date.now() + ":" + message + "-" + boardgame + "-" + owner);
    }
    static logWithBoardgame(message, boardgame) {
        console.log(Date.now() + ":" + message + "-" + boardgame);
    }
    static logWithOwner(message, owner) {
        console.log(Date.now() + ":" + message + "-" + owner);
    }
}
exports.LoggingService = LoggingService;
//# sourceMappingURL=logging-service.js.map