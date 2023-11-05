import {Client, Message, REST, Routes, TextChannel} from "discord.js";
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
                channel.bulkDelete(messages);
                await AtlasService.generateAtlasMessages(channel);
                //await channel.send({content: Messages.getBoardGameCollectionErrorMessage(), flags: [4096]});
            });
        });
    }

    public static async atlasOnlineMessage(client: Client): Promise<void> {
        client.channels.fetch(Config.ATLAS_COMMAND_CHANNEL_ID).then(async (channel: TextChannel) => {
            await channel.send({content: Messages.ATLAS_ONLINE_MESSAGE, flags: [4096]})
        });
    }

    private static async generateAtlasMessages(channel: TextChannel): Promise<void> {
        let boardgameMap: Map<string, string[]> = await AtlasService.getBoardGameMap();

        //Send intro message
        //await channel.send({content: Messages.getBoardGameCollectionIntroMessage(), flags: [4096]});

        //Sends Boardgames in messages no bigger than 2000
        let atlasMessage = '';
        for (let entry of boardgameMap.entries()) {
            if (atlasMessage != '') {
                if ((atlasMessage + '\n' + Messages.getBoardgameBox(entry)).length < 2000) {
                    atlasMessage = atlasMessage + '\n' + Messages.getBoardgameBox(entry);
                } else {
                    await channel.send({content: atlasMessage, flags: [4096]});
                    atlasMessage = Messages.getBoardgameBox(entry);
                }
            } else {
                atlasMessage = Messages.getBoardgameBox(entry);
            }
        }
        if (atlasMessage != '') {
            await channel.send({content: atlasMessage, flags: [4096]});
        }
    } 

    private static async getBoardGameMap(): Promise<Map<string, string[]>> {
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
        boardgameMap = new Map([...boardgameMap.entries()].sort());
        return boardgameMap;
    }

    
}