import Owner from "../domain/Owner";
import {LoggingService} from "./LoggingService";
import {ChatInputCommandInteraction} from "discord.js";

export class OwnerService {

    public static async retrieveOwner(interaction: ChatInputCommandInteraction): Promise<Owner | null> {
        try {
            return await Owner.findByPk(interaction.user.username);
        } catch (err) {
            await LoggingService.logError(err, "retrieve-owner", interaction);
        }
    }

    public static async doesOwnerExists(interaction: ChatInputCommandInteraction) {
        const owner: Owner = await this.retrieveOwner(interaction);
        return owner != undefined;
    }

    public static async saveOwner(interaction: ChatInputCommandInteraction): Promise<Owner> {
        try {
            return await Owner.create({
                username: interaction.user.username
            });
        } catch (err) {
            await LoggingService.logError(err, "save-owner", interaction);
        }
    }
}