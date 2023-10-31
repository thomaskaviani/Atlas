import {ChatInputCommandInteraction, Client, PermissionFlagsBits} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {LoggingService} from "../services/LoggingService";

export const RebootCommand: Command = {
    name: "reboot",
    description: "Reboots A.T.L.A.S.",
    options: null,
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        try {
            if (interaction.user.username == "thomaskaviani") {
                const content = Messages.ATLAS_REBOOT_MESSAGE;
                await interaction.reply({
                    ephemeral: false,
                    content
                });
                require('child_process').exec('sudo reboot', function (msg) {
                    console.log(msg)
                });
            } else {
                const content = Messages.ATLAS_NOT_ALLOWED;
                await interaction.reply({
                    ephemeral: true,
                    content
                });
            }
        } catch (err) {
            await LoggingService.logError(err, "reboot", interaction);
        }
    }
};
