import {Message} from "discord.js";

export class Messages {

    //ATLAS COMMAND
    public static readonly ATLAS_MESSAGE = "Hi, I'm ready to collect some boardgames 🎲🏰🧙‍♂️\n\nYou can try one of the following commands to add, remove and view games. "
        + "I'm using Monopoly as a game example and Atlas as a user example:\n\n"
        + "*Adding a game to the collection can be done with the following command*\n"
        + "**/add-game Monopoly**\n\n"
        + "*Removing you as an owner of a game from the collection can be done with the following command*\n"
        + "**/remove-game Monopoly**\n\n"
        + "*Showing the owners of a certain game can be done with the following command*\n"
        + "**/owners Monopoly**\n\n"
        + "*Showing the games a certain user owns can be done with the following command*\n"
        + "**/games Atlas**";

    //REBOOT COMMAND
    public static readonly ATLAS_REBOOT_MESSAGE = "☢ Rebooting ☢";
    public static readonly ATLAS_ONLINE_MESSAGE = "⚡ A.T.L.A.S. Online ⚡";
    public static readonly ATLAS_NOT_ALLOWED = "You are not allowed to do this";

    //OWNERS COMMAND
    public static readonly GAME_DOES_NOT_EXIST_MESSAGE = " is not present in my collection";
    public static readonly HAS_FOLLOWING_OWNERS = " has the following owners:\n\n";

    //GAMES COMMAND
    public static readonly USER_NOT_AN_OWNER_MESSAGE = "This user doesn't own any boardgames";
    public static readonly HAS_FOLLOWING_GAMES = " owns the following games:\n\n";

    //ADD GAME COMMAND
    public static readonly GAME_ADD_OWNER_MESSAGE = "I'm adding you as an owner of ";
    public static readonly ALREADY_OWN_GAME_MESSAGE = "You already own the game ";

    //REMOVE GAME COMMAND
    public static readonly REMOVED_FROM_GAME = "I removed you as an owner of ";
    public static readonly DONT_OWN_GAME_MESSAGE = "You don't own the game ";

    //ERROR HANDLING
    public static readonly ATLAS_ERROR = "Something went terribly wrong, contact the A.T.L.A.S. creator";
    public static readonly ATLAS_INITIALIZED = 'A.T.L.A.S. INITIALIZED';
    public static readonly ATLAS_CONNECTED_DB = 'A.T.L.A.S. CONNECTED TO DATABASE';
    public static readonly ATLAS_CHANNEL_FOUND = 'A.T.L.A.S. CHANNEL FOUND';

    public static capitalize(message: string): string {
        return message.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    }

    public static bold(message: string): string {
        return "**" + message + "**";
    }

    public static getBoardgameBox(entry: [string, string[]]): string {
        let boardGameBox = '**' + entry[0] + '**\n';
        let authorsLine = '``` ';
        for (let username of entry[1]) {
            if (authorsLine != '``` ') {
                authorsLine = authorsLine + ", " + username;
            } else {
                authorsLine = authorsLine + username;
            }
        }
        return boardGameBox + authorsLine + ' ```';
    }

    public static getBoardGameCollectionIntroMessage() {
        return '# The Collection 🎲🏰🧙‍♂️\n\n'
            + 'This is a collection of all the boardgames I know of. Feel free to add games by using A.T.L.A.S in other channels with the proper commands.\n'
            + 'You can always find out how to use A.T.L.A.S by typing **!atlas**';
    }

    //To use when working on game collection messages
    public static getBoardGameCollectionErrorMessage() {
        return '# ⚠ Under Construction ⚠\n\n'
            + 'This is a warning message, the game collection can currently not be displayed.\n'
            + 'All the atlas commands are still available while we are figuring out the problem.\n'
            + 'You can always find out how to use A.T.L.A.S by typing **!atlas** \n\n';
    }
}