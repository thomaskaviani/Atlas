import {Client, REST, Routes, TextChannel} from "discord.js";
import BoardGame from "../domain/BoardGame";
import CollectionLine from "../domain/CollectionLine";
import {Messages} from "../utils/Messages";
import {BoardgameService} from "./BoardgameService";
import {Config} from "../Config";
import {Commands} from "../commands/Commands";

export class AtlasService {

    public static async deleteCommands() {
        console.log(Config.ATLAS_TOKEN);
        const rest = new REST().setToken(Config.ATLAS_TOKEN);
        await rest.put(Routes.applicationCommands(Config.ATLAS_CLIENT_ID), {body: []});
    }

    public static async addCommands(client: Client): Promise<void> {
        await client.application.commands.set(Commands);
    }

    public static async updateAtlasMessage(client: Client): Promise<void> {
        client.channels.fetch(Config.ATLAS_COLLECTION_CHANNEL_ID).then(async (channel: TextChannel) => {
            channel.messages.fetch().then(async messages => {
                await messages.first()?.delete();
                const atlasMessage: string = await AtlasService.generateAtlasMessage();
                if (atlasMessage.length != 0) {
                    await channel.send({content: atlasMessage, flags: [4096]});
                }
            });
        });
    }

    private static async generateAtlasMessage(): Promise<string> {
        let boardgameMap: Map<string, string[]> = new Map<string, string[]>();
        let boardgames: BoardGame[] = await BoardgameService.retrieveAllBoardGames();

        for (let boardgame of boardgames) {
            let collectionLinesForGame: CollectionLine[] = await BoardgameService.retrieveLinesForBoardGame(boardgame.name, null);
            let owners: string[] = [];
            for (let collectionLine of collectionLinesForGame) {
                owners.push(collectionLine.ownerUserName);
            }
            if (owners.length > 0) {
                boardgameMap.set(Messages.capitalize(boardgame.name), owners);
            }
        }

        return '# The Collection 🎲🏰🧙‍♂️\n\n'
            + 'This is a collection of all the boardgames I know of. Feel free to add games by using A.T.L.A.S in other channels with the proper commands.\n'
            + 'You can always find out how to use A.T.L.A.S by typing **!atlas** \n\n'
            + Messages.getBoardgameBoxes(boardgameMap) + "\n\n";
    }
}