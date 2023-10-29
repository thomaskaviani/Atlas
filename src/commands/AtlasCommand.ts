import { CommandInteraction, Client, ApplicationCommandType, SlashCommandBuilder } from "discord.js";
import { Command } from "./Command";
import { Messages } from "../atlas/messages";

export const AtlasCommand : Command = {
    name: "atlas",
    description: "Gives you some information on how to use A.T.L.A.S.",
    data: new SlashCommandBuilder()
            .setName("atlas")
            .setDescription("Gives you some information on how to use A.T.L.A.S.")
            .addStringOption(option =>
                option
                    .setName('input')
                    .setDescription('The input to echo back')
                    .setRequired(true)
            ),
    run: (client: Client, interaction: CommandInteraction) => {
        const content = Messages.ATLAS_MESSAGE;

        interaction.followUp({
            ephemeral: true,
            content
        });
    }
};