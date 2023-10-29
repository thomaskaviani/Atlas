import {ApplicationCommandOptionBase, ChatInputApplicationCommandData, Client, CommandInteraction} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    name: string;
    description: string;
    options;
    run: (client: Client, interaction: CommandInteraction) => void;
}