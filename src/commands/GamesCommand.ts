import {AutocompleteInteraction, ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import CollectionLine from "../domain/CollectionLine";
import {LoggingService} from "../services/LoggingService";
import {AutoCompletableCommand} from "./AutoCompletableCommand";
import {OwnerService} from "../services/OwnerService";

export const GamesCommand: AutoCompletableCommand = {
    name: "games",
    description: "Shows the games a certain user owns",
    options: [new SlashCommandStringOption()
        .setName("owner")
        .setDescription("Enter the owner's username")
        .setRequired(true)],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        try {
            const focusedValue = interaction.options.getFocused();
            const owners = (await OwnerService.retrieveAllOwners()).map(x => x.username);
            const filtered = owners.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({name: choice, value: choice})),
            );
        } catch (err) {
            await LoggingService.logError(err, "autocomplete-games", interaction);
        }
    },
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            let username = interaction.options.get("owner").value;

            if (typeof username === "string" && username) {
                let collectionLinesForOwner: CollectionLine[] = await BoardgameService.retrieveLinesForOwner(username, interaction);
                let boardgameString: string = '';

                if (collectionLinesForOwner?.length > 0) {
                    for (let boardGame of CollectionLine.getCapitalizedBoardGameNames(collectionLinesForOwner)) {
                        boardgameString = boardgameString + boardGame + "\n";
                    }
                    const content = Messages.bold(username) + Messages.HAS_FOLLOWING_GAMES + boardgameString;
                    await interaction.reply({
                        content,
                        ephemeral: true
                    });
                } else {
                    const content = Messages.USER_NOT_AN_OWNER_MESSAGE;
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
