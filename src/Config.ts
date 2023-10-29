import {Sequelize} from "sequelize-typescript";
import BoardGame from "./domain/BoardGame";
import Owner from "./domain/Owner";
import CollectionLine from "./domain/CollectionLine";

export class Config {
    public static readonly ATLAS_CLIENT_ID = "1136339948832825466";
    public static readonly ATLAS_TOKEN = process.env.DISCORD_TOKEN;
    public static readonly ATLAS_COLLECTION_CHANNEL_ID = process.env.DISCORD_HOARD_CHANNEL_ID;

    public static readonly DB_HOST: string = process.env.DATABASE_HOST;
    public static readonly DB_USER: string = process.env.DATABASE_PASSWORD;
    public static readonly DB_PASSWORD: string = process.env.DATABASE_HOST;
    public static readonly DB_PORT: string = "5432";
    public static readonly DB_NAME: string = "postgres";

    public static readonly SEQUELIZE = new Sequelize({
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        logging: false,
        dialect: "postgres",
        models: [BoardGame, Owner, CollectionLine]
    });
}