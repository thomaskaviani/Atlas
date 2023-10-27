"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
class Messages {
    static replySilent(message, messageContent) {
        void message.reply({ content: messageContent, flags: [4096] });
    }
    static capitalize(message) {
        return message.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    }
    static bold(message) {
        return "**" + message + "**";
    }
    static getBoardgameBoxes(boardgameMap) {
        boardgameMap = new Map([...boardgameMap.entries()].sort());
        let boardgameBoxes = '';
        for (let entry of boardgameMap.entries()) {
            if (boardgameBoxes != '') {
                boardgameBoxes = boardgameBoxes + '\n' + Messages.getBoardgameBox(entry);
            }
            else {
                boardgameBoxes = Messages.getBoardgameBox(entry);
            }
        }
        return boardgameBoxes;
    }
    static getBoardgameBox(entry) {
        let boardGameBox = '**' + entry[0] + '**\n';
        let authorsLine = '``` ';
        for (let username of entry[1]) {
            if (authorsLine != '``` ') {
                authorsLine = authorsLine + ", " + username;
            }
            else {
                authorsLine = authorsLine + username;
            }
        }
        return boardGameBox + authorsLine + ' ```';
    }
}
exports.Messages = Messages;
Messages.ATLAS_MESSAGE = "Hi, I'm ready to collect some boardgames 🎲🏰🧙‍♂️\n\nYou can try one of the following commands to add, remove and view games. "
    + "I'm using Monopoly as a game example and Atlas as a user example:\n\n"
    + "*Adding a game to the collection can be done with the following command*\n"
    + "**!addgame Monopoly**\n\n"
    + "*Removing you as an owner of a game from the collection can be done with the following command*\n"
    + "**!removegame Monopoly**\n\n"
    + "*Showing the owners of a certain game can be done with the following command*\n"
    + "**!owners Monopoly**\n\n"
    + "*Showing the games a certain user owns can be done with the following command*\n"
    + "**!games Atlas**";
Messages.GAME_DOES_NOT_EXIST_ADD_NOW_MESSAGE = "I don't know this game yet, thank you for expanding my collection";
Messages.GAME_DOES_NOT_EXIST_MESSAGE = " is not present in my collection";
Messages.USER_NOT_AN_OWNER_MESSAGE = "This user is not an owner of any boardgames";
Messages.GAME_ADD_OWNER_MESSAGE = "I'm adding you as an owner of ";
Messages.HAS_FOLLOWING_OWNERS = " has the following owners:\n\n";
Messages.HAS_FOLLOWING_GAMES = " owns the following games:\n\n";
Messages.REMOVED_FROM_GAME = "I removed you as an owner of ";
Messages.DONT_OWN_GAME_MESSAGE = "You don't own the game ";
Messages.ADD_GAME_INCOMPLETE_COMMAND = "*This command is incomplete, try adding an actual game after the command itself like:*\n\n**!addgame Monopoly**";
Messages.REMOVE_GAME_INCOMPLETE_COMMAND = "*This command is incomplete, try adding an actual game after the command itself like:*\n\n**!removegame Monopoly**";
Messages.GAMES_INCOMPLETE_COMMAND = "*This command is incomplete, try adding an actual game after the command itself like:*\n\n**!owners Monopoly**";
Messages.OWNER_INCOMPLETE_COMMAND = "*This command is incomplete, try adding an actual owner after the command itself like:*\n\n**!games Atlas**\n\n*The username of the owner is case sensitive!*";
//# sourceMappingURL=messages.js.map