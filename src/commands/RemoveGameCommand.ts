import {AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import {AtlasService} from "../services/AtlasService";
import {LoggingService} from "../services/LoggingService";
import {AutoCompletableCommand} from "./AutoCompletableCommand";

export const RemoveGameCommand: AutoCompletableCommand = {
    name: "remove-game",
    description: "Removes you as an owner of a boardgame",
    options: [new SlashCommandStringOption()
        .setName("boardgame")
        .setDescription("Enter the boardgame name")
        .setRequired(true)],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        try {
            const focusedValue = interaction.options.getFocused();
            const boardgames = (await BoardgameService.retrieveLinesForOwner(interaction.user.username, interaction)).map(x => x.boardGameName);
            const filtered = boardgames.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        } catch (err) {
            await LoggingService.logError(err, "autocomplete-remove-game", interaction);
        }
    },
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            let boardgame = interaction.options.get("boardgame").value;

            if (typeof boardgame === "string" && boardgame) {
                boardgame = boardgame.toLowerCase();
                if (await BoardgameService.doesOwnerHaveGame(boardgame, interaction)) {
                    await BoardgameService.deleteCollectionLine(boardgame, interaction);
                    const content = Messages.REMOVED_FROM_GAME + boardgame
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                    await AtlasService.updateAtlasMessage(client);
                } else {
                    const content = Messages.DONT_OWN_GAME_MESSAGE + boardgame;
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                }
            }
        } catch (err) {
            await LoggingService.logError(err, "reboot", interaction);
        }
    }
};