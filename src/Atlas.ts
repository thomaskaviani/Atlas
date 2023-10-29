require('dotenv').config();
import {LoggingService} from './services/LoggingService';
import {Client, GatewayIntentBits} from "discord.js";
import {Logging} from "./utils/Logging";
import interactionCreateListener from './listeners/InteractionCreateListener';
import messageCreateListener from "./listeners/MessageCreateListener";
import {AtlasService} from "./services/AtlasService";
import {Config} from "./Config";

export class Atlas {
    private readonly discordClient: Client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    public startup(): void {
        Config.SEQUELIZE.authenticate()
            .then(() => {
                LoggingService.log(Logging.ATLAS_CONNECTED_DB);
                void this.run();
            })
            .catch((err) => {
                LoggingService.logWithError(Logging.ATLAS_CONNECTING_FAILED, err)
            });
    }

    public run() {
        this.initializeAtlas();

        messageCreateListener(this.discordClient);
        interactionCreateListener(this.discordClient);

        return this.discordClient.login(Config.ATLAS_TOKEN);
    }

    private initializeAtlas(): void {
        this.discordClient.on('ready', async () => {
            await AtlasService.deleteCommands();
            await AtlasService.addCommands(this.discordClient);
            LoggingService.log(Logging.ATLAS_INITIALIZED);
            await AtlasService.updateAtlasMessage(this.discordClient);
        });
    }
}

let atlas = new Atlas().run();