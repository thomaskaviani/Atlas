import {ChatInputCommandInteraction, Client, SlashCommandStringOption} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "../services/BoardgameService";
import {OwnerService} from "../services/OwnerService";
import {AtlasService} from "../services/AtlasService";

export const AddGameCommand: Command = {
    name: "add-game",
    description: "Adds you as an owner of a boardgame",
    options: [new SlashCommandStringOption()
        .setName("name")
        .setDescription("Enter the boardgame name")
        .setRequired(true)],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let boardgame = interaction.options.get("name").value;
        if (typeof boardgame === "string" && boardgame) {
            boardgame = boardgame.toLowerCase();
            if (!await OwnerService.doesOwnerExists(interaction.user.username)) {
                await OwnerService.saveOwner(interaction.user.username);
            }

            if (!await BoardgameService.doesBoardGameExists(boardgame)) {
                await BoardgameService.saveBoardGame(boardgame, 0);
            }

            if (!await BoardgameService.doesOwnerHaveGame(boardgame, interaction.user.username)) {
                const content = Messages.GAME_ADD_OWNER_MESSAGE + boardgame;
                await BoardgameService.saveCollectionLine(boardgame, interaction.user.username);
                await interaction.reply({
                    content,
                    ephemeral: true
                });
                await AtlasService.updateAtlasMessage(client);
            } else {
                const content = Messages.ALREADY_OWN_GAME_MESSAGE + boardgame;
                await interaction.reply({
                    content,
                    ephemeral: true
                });
            }
        }
    }
};