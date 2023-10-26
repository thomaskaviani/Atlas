"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const atlas_1 = require("./atlas/atlas");
const discord_js_1 = require("discord.js");
const game_service_1 = require("./services/game-service");
let container = new inversify_1.Container();
container.bind(types_1.TYPES.Atlas).to(atlas_1.Atlas).inSingletonScope();
container.bind(types_1.TYPES.GameService).to(game_service_1.GameService).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ] }));
container.bind(types_1.TYPES.Token).toConstantValue(process.env.DISCORD_TOKEN);
container.bind(types_1.TYPES.ChannelId).toConstantValue(process.env.DISCORD_HOARD_CHANNEL_ID);
container.bind(types_1.TYPES.DBHost).toConstantValue(process.env.DATABASE_HOST);
container.bind(types_1.TYPES.DBUser).toConstantValue(process.env.DATABASE_USER);
container.bind(types_1.TYPES.DBPassword).toConstantValue(process.env.DATABASE_PASSWORD);
container.bind(types_1.TYPES.DBPort).toConstantValue(process.env.DATABASE_PORT);
container.bind(types_1.TYPES.DBName).toConstantValue(process.env.DATABASE_NAME);
exports.default = container;
//# sourceMappingURL=inversify.config.js.map