import {ChatInputCommandInteraction, Client} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {LoggingService} from "../services/LoggingService";

export const AtlasCommand: Command = {
    name: "atlas",
    description: "Gives you some information on how to use A.T.L.A.S.",
    options: null,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            const content = Messages.ATLAS_MESSAGE;

            await interaction.reply({
                content,
                ephemeral: true
            });
        } catch (err) {
            await LoggingService.logError(err, "atlas", interaction);
        }
    }
};