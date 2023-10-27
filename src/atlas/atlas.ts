import 'reflect-metadata';
import {inject, injectable} from "inversify";
import {TYPES} from "../types"
import {LoggingService} from '../services/logging-service';
import {Client, Message, TextChannel} from "discord.js";
import {Commands} from './commands';
import {Messages} from './messages';
import {GameService} from '../services/game-service';
import BoardGame from '../domain/boardgame';
import CollectionLine from '../domain/collection-line';
import {Logging} from "./logging";

@injectable()
export class Atlas {
    private atlasChannelId: string;
    private atlasChannel: TextChannel;
    private discordClient: Client;
    private readonly token: string;

    public readonly dbHost: string;
    public readonly dbUser: string;
    public readonly dbPassword: string;
    public readonly dbPort: string;
    public readonly dbName: string;

    private gameService: GameService;

    constructor(@inject(TYPES.Client) client: Client,
                @inject(TYPES.Token) token: string,
                @inject(TYPES.ChannelId) channelId: string,
                @inject(TYPES.DBHost) dbHost: string,
                @inject(TYPES.DBUser) dbUser: string,
                @inject(TYPES.DBPassword) dbPassword: string,
                @inject(TYPES.DBPort) dbPort: string,
                @inject(TYPES.DBName) dbName: string,
                @inject(TYPES.GameService) gameService: GameService) {
        this.discordClient = client;
        this.token = token;
        this.atlasChannelId = channelId;
        this.dbHost = dbHost;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
        this.dbPort = dbPort;
        this.dbName = dbName;

        this.gameService = gameService;
    }

    public run() {
        this.initializeAtlas();
        this.listen();

        return this.discordClient.login(this.token);
    }

    //Private methods
    private initializeAtlas(): void {
        this.discordClient.on('ready', () => {
            this.retrieveAtlasChannel();
            LoggingService.log(Logging.ATLAS_INITIALIZED);
        });
    }

    private retrieveAtlasChannel(): void {
        this.discordClient.channels.fetch(this.atlasChannelId).then((channel: TextChannel) => {
            LoggingService.log(Logging.ATLAS_CHANNEL_FOUND);
            this.atlasChannel = channel;
            this.updateAtlasMessage();
        });
    }

    private listen(): void {
        LoggingService.log(Logging.ATLAS_LISTENING);
        this.discordClient.on('messageCreate', (message: Message) => {
            if (this.isValidAtlasChannel()) {
                this.handleDiscordMessage(message);
            }
        });
    }

    private handleDiscordMessage(message: Message): void {
        Atlas.handleAtlasCommand(message);
        Atlas.handleRebootCommand(message);

        void this.handleAddGameCommand(message);
        void this.handleRemoveGameCommand(message);
        void this.handleOwnerCommand(message);
        void this.handleGamesCommand(message);
    }

    private static handleAtlasCommand(message: Message) {
        if (Commands.isAtlasCommand(message)) {
            LoggingService.logDiscordMessage(message);
            Messages.replySilent(message, Messages.ATLAS_MESSAGE);
        }
    }

    private static handleRebootCommand(message: Message) {
        if (Commands.isRebootCommand(message) && message.author.username == 'thomaskaviani') {
            LoggingService.logDiscordMessage(message);
            Messages.replySilent(message, Messages.ATLAS_REBOOT_MESSAGE);
            require('child_process').exec('sudo reboot', function (msg) { console.log(msg) });
        }
    }

    private async handleRemoveGameCommand(message: Message): Promise<void> {
        if (Commands.isRemoveGameCommand(message) && this.isValidAtlasChannel()) {
            LoggingService.logDiscordMessage(message);
            const boardgame = message.content.slice(12).toLowerCase();
            if (!boardgame) {
                Messages.replySilent(message, Messages.REMOVE_GAME_INCOMPLETE_COMMAND);
                return;
            }
            if (await this.gameService.doesOwnerHaveGame(boardgame, message.author.username)) {
                await this.gameService.deleteCollectionLine(boardgame, message.author.username);
                this.updateAtlasMessage();
                Messages.replySilent(message, Messages.REMOVED_FROM_GAME + boardgame);
            } else {
                Messages.replySilent(message, Messages.DONT_OWN_GAME_MESSAGE + boardgame);
            }
        }
    }

    private async handleAddGameCommand(message: Message): Promise<void> {
        if (Commands.isAddGameCommand(message) && this.isValidAtlasChannel()) {
            LoggingService.logDiscordMessage(message);
            const gameString = message.content.slice(9).toLowerCase();
            if (!gameString) {
                Messages.replySilent(message, Messages.ADD_GAME_INCOMPLETE_COMMAND);
                return;
            }

            if (!await this.gameService.doesOwnerExists(message.author.username)) {
                await this.gameService.saveOwner(message.author.username);
            }

            if (!await this.gameService.doesBoardGameExists(gameString)) {
                Messages.replySilent(message, Messages.GAME_DOES_NOT_EXIST_ADD_NOW_MESSAGE);
                await this.gameService.saveBoardGame(gameString, 0);
            }

            if (!await this.gameService.doesOwnerHaveGame(gameString, message.author.username)) {
                Messages.replySilent(message, Messages.GAME_ADD_OWNER_MESSAGE + gameString);
                await this.gameService.saveCollectionLine(gameString, message.author.username);
                this.updateAtlasMessage();
            }
        }
    }

    private async handleOwnerCommand(message: Message) {
        if (Commands.isOwnersCommand(message)) {
            LoggingService.logDiscordMessage(message);
            const boardgame = message.content.slice(8).toLowerCase();
            if (!boardgame) {
                Messages.replySilent(message, Messages.GAMES_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.gameService.doesBoardGameExists(boardgame)) {
                Messages.replySilent(message, Messages.bold(boardgame) + Messages.GAME_DOES_NOT_EXIST_MESSAGE);
            } else {
                let collectionLinesForBoardGame: CollectionLine[] = await this.gameService.retrieveLinesForBoardGame(boardgame);
                let ownerString: string = '';

                for (let owner of CollectionLine.getOwners(collectionLinesForBoardGame)) {
                    ownerString = ownerString + owner + "\n";
                }

                Messages.replySilent(message, Messages.bold(Messages.capitalize(boardgame)) + Messages.HAS_FOLLOWING_OWNERS + ownerString);
            }
        }
    }

    private async handleGamesCommand(message: Message) {
        if (Commands.isGamesCommand(message)) {
            LoggingService.logDiscordMessage(message);
            const ownerString = message.content.slice(7);
            if (!ownerString) {
                Messages.replySilent(message, Messages.OWNER_INCOMPLETE_COMMAND);
                return;
            }
            if (!await this.gameService.doesOwnerExists(ownerString)) {
                Messages.replySilent(message, Messages.USER_NOT_AN_OWNER_MESSAGE);
            } else {
                let collectionLinesForOwner: CollectionLine[] = await this.gameService.retrieveLinesForOwner(ownerString);
                let boardgameString: string = '';

                for (let boardGame of CollectionLine.getCapitalizedBoardGameNames(collectionLinesForOwner)) {
                    boardgameString = boardgameString + boardGame + "\n";
                }
                Messages.replySilent(message, Messages.bold(ownerString) + Messages.HAS_FOLLOWING_GAMES + boardgameString);
            }
        }
    }

    private updateAtlasMessage(): void {
        this.atlasChannel.messages.fetch().then(async messages => {
            await messages.first()?.delete();
            const atlasMessage: string = await this.generateAtlasMessage();
            if (atlasMessage.length != 0) {
                await this.atlasChannel.send(atlasMessage);
            }
        });
    }

    private isValidAtlasChannel(): boolean {
        return this.atlasChannel.messages != null;
    }

    private async generateAtlasMessage(): Promise<string> {
        let boardgameMap: Map<string, string[]> = new Map<string, string[]>();
        let boardgames: BoardGame[] = await this.gameService.retrieveAllBoardGames();

        for (let boardgame of boardgames) {
            let collectionLinesForGame: CollectionLine[] = await this.gameService.retrieveLinesForBoardGame(boardgame.name);
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