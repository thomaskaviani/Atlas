import {Messages} from "./utils/Messages";
import {LoggingService} from './services/LoggingService';
import {Client, GatewayIntentBits} from "discord.js";
import interactionCreateListener from './listeners/InteractionCreateListener';
import messageCreateListener from "./listeners/MessageCreateListener";
import {AtlasService} from "./services/AtlasService";
import {Config} from "./Config";

require('dotenv').config();

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
                LoggingService.log(Messages.ATLAS_CONNECTED_DB);
                void this.run();
            })
            .catch((err) => {
                LoggingService.logError(err, "database", null);
            });
    }

    public run() {
        this.initializeAtlas();

        messageCreateListener(this.discordClient);
        interactionCreateListener(this.discordClient);

        return this.discordClient.login(Config.ATLAS_TOKEN);
    }

    private initializeAtlas(): void {
        LoggingService.initializeLogFile();
        this.discordClient.on('ready', async () => {
            await AtlasService.deleteCommands();
            await AtlasService.addCommands(this.discordClient);
            await LoggingService.log(Messages.ATLAS_INITIALIZED);
            await AtlasService.updateAtlasMessage(this.discordClient);
            await LoggingService.log(Messages.ATLAS_CHANNEL_FOUND);
        });
    }
}
let atlas = new Atlas().run();