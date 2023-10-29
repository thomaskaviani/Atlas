import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Atlas} from "./atlas";
import {Client,GatewayIntentBits} from "discord.js";
import { GameService } from "./services/game-service";

let container = new Container();

container.bind<Atlas>(TYPES.Atlas).to(Atlas).inSingletonScope();
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
container.bind<string>(TYPES.DBHost).toConstantValue(process.env.DATABASE_HOST);
container.bind<string>(TYPES.DBUser).toConstantValue(process.env.DATABASE_USER);
container.bind<string>(TYPES.DBPassword).toConstantValue(process.env.DATABASE_PASSWORD);
container.bind<string>(TYPES.DBPort).toConstantValue(process.env.DATABASE_PORT);
container.bind<string>(TYPES.DBName).toConstantValue(process.env.DATABASE_NAME);

export default container;