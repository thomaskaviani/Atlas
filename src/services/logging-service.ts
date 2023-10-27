import {Message} from "discord.js";

export class LoggingService {

    public static log(message: string): void {
        console.log(Date.now() + ":" + message);
    }

    public static logWithError(message: string, error: any): void {
        console.log(Date.now() + ":" + message, error);
    }

    public static logDiscordMessage(message: Message): void {
        console.log(Date.now() + ":" + 'received message:' + message.content + ' - ' + message.author.username);
    }

    public static logWithBoardgameAndOwner(message: string, boardgame: string, owner: string) {
        console.log(Date.now() + ":" + message + "-" + boardgame + "-" + owner);
    }

    public static logWithBoardgame(message: string, boardgame: string) {
        console.log(Date.now() + ":" + message + "-" + boardgame);
    }

    public static logWithOwner(message: string, owner: string) {
        console.log(Date.now() + ":" + message + "-" + owner);
    }
}