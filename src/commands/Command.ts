import { CommandInteraction, ChatInputApplicationCommandData, Client, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    name: string;
    description: string; 
    data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
    run: (client: Client, interaction: CommandInteraction) => void;
}