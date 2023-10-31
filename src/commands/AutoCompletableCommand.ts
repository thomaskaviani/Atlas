import {AutocompleteInteraction, Client} from "discord.js";
import {Command} from "./Command";

export interface AutoCompletableCommand extends Command {
    name: string;
    description: string;
    options;
    autocomplete: (interaction: AutocompleteInteraction) => void;
}