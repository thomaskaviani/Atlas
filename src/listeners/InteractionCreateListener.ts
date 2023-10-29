import {ChatInputCommandInteraction, Client, Interaction} from "discord.js";
import {Commands} from "../commands/Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            interaction = <ChatInputCommandInteraction>interaction;
            await handleChatInputCommand(client, interaction);
        }
    });
};

const handleChatInputCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const chatInputCommand = Commands.find(c => c.name === interaction.commandName);
    if (!chatInputCommand) {
        await interaction.reply({content: "An error has occurred", ephemeral: true});
        return;
    }
    chatInputCommand.run(client, interaction);
};