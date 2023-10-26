"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
class LoggingService {
    static log(message) {
        console.log(Date.now() + ": " + message);
    }
    static logWithError(message, error) {
        console.log(Date.now() + ": " + message, error);
    }
    static logDiscordMessage(message) {
        console.log(Date.now() + ": " + 'received message:' + message.content + ' - ' + message.author.username);
    }
    static logObject(object) {
        console.log(object);
    }
}
exports.LoggingService = LoggingService;
//# sourceMappingURL=logging-service.js.map