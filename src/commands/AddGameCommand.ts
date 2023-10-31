import {ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import {OwnerService} from "../services/OwnerService";
import {AtlasService} from "../services/AtlasService";
import {LoggingService} from "../services/LoggingService";

export const AddGameCommand: Command = {
    name: "add-game",
    description: "Adds you as an owner of a boardgame",
    options: [new SlashCommandStringOption()
        .setName("boardgame")
        .setDescription("Enter the boardgame name")
        .setRequired(true)],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            let boardgame = interaction.options.get("boardgame").value;

            if (typeof boardgame === "string" && boardgame) {
                boardgame = boardgame.toLowerCase();
                if (!await OwnerService.doesOwnerExists(interaction)) {
                    await OwnerService.saveOwner(interaction);
                }

                if (!await BoardgameService.doesBoardGameExists(boardgame, interaction)) {
                    await BoardgameService.saveBoardGame(boardgame, 0, interaction);
                }

                if (!await BoardgameService.doesOwnerHaveGame(boardgame, interaction)) {
                    const content = Messages.GAME_ADD_OWNER_MESSAGE + Messages.bold(boardgame);
                    await BoardgameService.saveCollectionLine(boardgame, interaction);
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                    await AtlasService.updateAtlasMessage(client);
                } else {
                    const content = Messages.ALREADY_OWN_GAME_MESSAGE + Messages.bold(boardgame);
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                }
            }
        } catch (err) {
            await LoggingService.logError(err, "add-game", interaction);
        }
    }
};