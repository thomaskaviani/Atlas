import {Client, CommandInteraction} from "discord.js";
import {Command} from "./Command";
import {Messages} from "../utils/Messages";
import {LoggingService} from "../services/LoggingService";

export const AtlasCommand: Command = {
    name: "atlas",
    description: "Gives you some information on how to use A.T.L.A.S.",
    options: null,
    run: (client: Client, interaction: CommandInteraction) => {
        const content = Messages.ATLAS_MESSAGE;

        interaction.reply({
            content,
            ephemeral: true
        }).then(r => LoggingService.log("returned atlas information"));
    }
};