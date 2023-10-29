import { CommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { Command } from "./Command";
import { Messages } from "../atlas/messages";

export const RebootCommand : Command = {
    name: "reboot",
    description: "Reboots A.T.L.A.S.",
    data: new SlashCommandBuilder()
            .setName("reboot")
            .setDescription("Reboots A.T.L.A.S."),
    run: (client: Client, interaction: CommandInteraction) => {
        let content = ''
        if (interaction.user.username == "thomaskaviani") {
            const content = Messages.ATLAS_REBOOT_MESSAGE;
            interaction.followUp({
                ephemeral: true,
                content
            });
            //require('child_process').exec('sudo reboot', function (msg) { console.log(msg) });
        } else {
            const content = Messages.ATLAS_NOT_ALLOWED;
            interaction.followUp({
                ephemeral: true,
                content
            });
        }
    }
};