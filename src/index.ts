import {Logging} from "./atlas/logging";

require('dotenv').config();
import 'reflect-metadata';
import container from "./inversify.config";
import {TYPES} from "./types";
import {Atlas} from "./atlas";
import BoardGame from './domain/boardgame';
import { Sequelize } from "sequelize-typescript";
import Owner from './domain/owner';
import CollectionLine from './domain/collection-line';
import { LoggingService } from "./services/logging-service";

let bot = container.get<Atlas>(TYPES.Atlas);

let sequelize = new Sequelize({
    database: bot.dbName,
    username: bot.dbUser,
    password: bot.dbPassword,
    host: bot.dbHost,
    logging: false,
    dialect: "postgres",
    models: [BoardGame, Owner, CollectionLine]
});

sequelize
    .authenticate()
    .then(() => {
        LoggingService.log(Logging.ATLAS_CONNECTED_DB);
        void bot.run();
    })
    .catch((err) => {
        LoggingService.logWithError(Logging.ATLAS_CONNECTING_FAILED, err)
    });