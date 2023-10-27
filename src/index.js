"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./atlas/logging");
require('dotenv').config();
require("reflect-metadata");
const inversify_config_1 = require("./inversify.config");
const types_1 = require("./types");
const boardgame_1 = require("./domain/boardgame");
const sequelize_typescript_1 = require("sequelize-typescript");
const owner_1 = require("./domain/owner");
const collection_line_1 = require("./domain/collection-line");
const logging_service_1 = require("./services/logging-service");
let bot = inversify_config_1.default.get(types_1.TYPES.Atlas);
let sequelize = new sequelize_typescript_1.Sequelize({
    database: bot.dbName,
    username: bot.dbUser,
    password: bot.dbPassword,
    host: bot.dbHost,
    dialect: "postgres",
    models: [boardgame_1.default, owner_1.default, collection_line_1.default]
});
sequelize
    .authenticate()
    .then(() => {
    logging_service_1.LoggingService.log(logging_1.Logging.ATLAS_CONNECTED_DB);
    void bot.run();
})
    .catch((err) => {
    logging_service_1.LoggingService.logWithError(logging_1.Logging.ATLAS_CONNECTING_FAILED, err);
});
//# sourceMappingURL=index.js.map