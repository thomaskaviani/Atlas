import {AutocompleteInteraction, ChatInputCommandInteraction, Client, Interaction} from "discord.js";
import {Commands, AutoCompletableCommands} from "../commands/Commands";
import {LoggingService} from "../services/LoggingService";
import {Messages} from "../utils/Messages";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            interaction = <ChatInputCommandInteraction>interaction;
            await handleChatInputCommand(client, interaction);
        }
        if (interaction.isAutocomplete()) {
            interaction = <AutocompleteInteraction>interaction;
            await handleAutoComplete(interaction);
        }
    });
};

const handleChatInputCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const chatInputCommand = Commands.find(c => c.name === interaction.commandName);
    if (!chatInputCommand) {
        await interaction.reply({content: Messages.ATLAS_ERROR, ephemeral: true});
        return;
    }
    chatInputCommand.run(client, interaction);
};

const handleAutoComplete = async (interaction: AutocompleteInteraction): Promise<void> => {
    const chatInputCommand = AutoCompletableCommands.find(c => c.name === interaction.commandName);
    if (!chatInputCommand) {
        await LoggingService.logError("no CommandAutoCompletable found with the name " + interaction.commandName, "autocomplete", interaction)
        return;
    }
    chatInputCommand.autocomplete(interaction);
};