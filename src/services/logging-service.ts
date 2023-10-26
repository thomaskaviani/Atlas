import {Message} from "discord.js";

export class LoggingService {

    public static log(message: string): void {
        console.log(Date.now() + ": " + message);
    }

    public static logWithError(message: string, error: any): void {
        console.log(Date.now() + ": " + message, error);
    }

    public static logDiscordMessage(message: Message): void {
        console.log(Date.now() + ": " + 'received message:' + message.content + ' - ' + message.author.username);
    }

    public static logObject(object: any) {
        console.log(object);
    }
}