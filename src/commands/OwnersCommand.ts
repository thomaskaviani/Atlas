import {ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import CollectionLine from "../domain/CollectionLine";
import {LoggingService} from "../services/LoggingService";

export const OwnersCommand: Command = {
    name: "owners",
    description: "Shows the owners of a certain boardgame",
    options: [new SlashCommandStringOption()
        .setName("boardgame")
        .setDescription("Enter the boardgame name")
        .setRequired(true)],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            let boardgame = interaction.options.get("boardgame").value;
            if (typeof boardgame === "string" && boardgame) {
                boardgame = boardgame.toLowerCase();
                let collectionLinesForBoardGame: CollectionLine[] = await BoardgameService.retrieveLinesForBoardGame(boardgame, interaction);
                let ownerString: string = '';

                if (collectionLinesForBoardGame?.length > 0) {
                    for (let owner of CollectionLine.getOwners(collectionLinesForBoardGame)) {
                        ownerString = ownerString + owner + "\n";
                    }
                    const content = Messages.bold(Messages.capitalize(boardgame)) + Messages.HAS_FOLLOWING_OWNERS + ownerString;
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                } else {
                    const content = Messages.bold(boardgame) + Messages.GAME_DOES_NOT_EXIST_MESSAGE;
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                }
            }
        } catch (err) {
            await LoggingService.logError(err, "owners", interaction);
        }
    }
};
