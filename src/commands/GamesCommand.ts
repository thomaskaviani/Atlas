import {ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import CollectionLine from "../domain/CollectionLine";

export const GamesCommand: Command = {
    name: "games",
    description: "Shows the games a certain user owns",
    options: [new SlashCommandStringOption()
        .setName("owner")
        .setDescription("Enter the owner's username")
        .setRequired(true)],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let username = interaction.options.get("user").value;

        if (typeof username === "string" && username) {
            let collectionLinesForOwner: CollectionLine[] = await BoardgameService.retrieveLinesForOwner(username);
            let boardgameString: string = '';

            if (collectionLinesForOwner?.length > 0) {
                for (let boardGame of CollectionLine.getCapitalizedBoardGameNames(collectionLinesForOwner)) {
                    boardgameString = boardgameString + boardGame + "\n";
                }
                const content = username + Messages.HAS_FOLLOWING_GAMES + boardgameString;
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
    }
};