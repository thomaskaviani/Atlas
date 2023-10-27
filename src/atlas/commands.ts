import {Message} from "discord.js";

export class Commands {
    public static readonly ATLAS = '!atlas';
    public static readonly ADD_GAME = '!addgame';
    public static readonly REMOVE_GAME = '!removegame';
    public static readonly OWNER = '!owners';
    public static readonly GAMES = '!games';
    public static readonly REBOOT = '!reboot';

    public static isAtlasCommand(message: Message) {
        return message.content.toLowerCase() == Commands.ATLAS;
    }

    public static isRebootCommand(message: Message) {
        return message.content.toLowerCase().startsWith(Commands.REBOOT);
    }

    public static isAddGameCommand(message: Message) {
        return message.content.toLowerCase().startsWith(Commands.ADD_GAME) && message.content.slice(8).startsWith(' ');
    }

    public static isOwnersCommand(message: Message) {
        return message.content.toLowerCase().startsWith(Commands.OWNER) && message.content.slice(7).startsWith(' ');
    }

    public static isGamesCommand(message: Message) {
        return message.content.toLowerCase().startsWith(Commands.GAMES) && message.content.slice(6).startsWith(' ');
    }

    public static isRemoveGameCommand(message: Message) {
        return message.content.toLowerCase().startsWith(Commands.REMOVE_GAME) && message.content.slice(11).startsWith(' ');
    }
}