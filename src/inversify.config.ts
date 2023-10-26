import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Atlas} from "./atlas/atlas";
import {Client,GatewayIntentBits} from "discord.js";
import { GameService } from "./services/game-service";

let container = new Container();

container.bind<HoardBot>(TYPES.HoardBot).to(HoardBot).inSingletonScope();
container.bind<GameService>(TYPES.GameService).to(GameService).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
    new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]})
);
container.bind<string>(TYPES.Token).toConstantValue(process.env.DISCORD_TOKEN);
container.bind<string>(TYPES.ChannelId).toConstantValue(process.env.DISCORD_HOARD_CHANNEL_ID);

export default container;