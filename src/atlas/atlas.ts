import 'reflect-metadata';
import {inject, injectable} from "inversify";
import {TYPES} from "./../types"
import {LoggingService} from '../services/logging-service';
import {Client, Message, TextChannel} from "discord.js";
import {Commands} from './commands';
import {GameService} from '../services/game-service';
import BoardGame from '../domain/boardgame';
import CollectionLine from '../domain/collection-line';
import Owner from '../domain/owner';

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
      LoggingService.log('Atlas initialized');
    });
  }

  private retrieveAtlasChannel(): void {
    this.discordClient.channels.fetch(this.atlasChannelId).then((channel: TextChannel) => {
      LoggingService.log('atlasChannel found');
      this.atlasChannel = channel;
      this.updateAtlasMessage();
    });
  }

  private listen(): void {
    LoggingService.log('Listening to messages');
    this.discordClient.on('messageCreate', (message: Message) => {
      if (this.isValidAtlasChannel())
        LoggingService.logDiscordMessage(message);
        this.handleDiscordMessage(message);
    });
  }

  private handleDiscordMessage(message: Message): void {
    this.handleTestCommand(message);
    this.handleAddGameCommand(message);
    this.handleOwnerCommand(message);
    this.handleGamesCommand(message);
  }

  private handleTestCommand(message: Message) {
    if (this.isTestCommand(message)) {
      message.reply({ content:
        "Hi, I'm ready to collect some boardgames 🎲🏰🧙‍♂️\n"+
        "You can add a game to our collection with the following command:\n" +
        "!addGame Monopoly", flags: [ 4096 ]});
    }
  }

  private async handleAddGameCommand(message: Message) {
    if (this.isAddGameCommand(message) && this.isValidAtlasChannel()) {
      const gameString = message.content.slice(9);
      if (!await this.doesOwnerExists(message.author.username)) {
        this.gameService.saveOwner(message.author.username);
      }

      if (!await this.doesBoardGameExists(gameString)) {
        message.reply({ content: "I don't know this game yet, thank you for expanding our collection", flags: [ 4096 ]});
        this.gameService.saveBoardGame(gameString, 0);
      }

      if (!await this.doesOwnerHaveGame(gameString, message.author.username)) {
        message.reply({ content: "I'm adding you as an owner of " + gameString, flags: [ 4096 ]});
        this.gameService.saveCollectionLine(gameString, message.author.username);
        this.updateAtlasMessage();
      }
    }
  }

  private async handleOwnerCommand(message: Message) {
    if (this.isOwnersCommand(message)) {
      const gameString = message.content.slice(8);
      console.log(gameString);
      if (!await this.doesBoardGameExists(gameString)) {
          message.reply({ content: "This game is not present in our collection", flags: [ 4096 ]});
      } else {
        let collectionLinesForBoardGame: CollectionLine[] = await this.gameService.retrieveLinesForBoardGame(gameString);
        let ownerString: string = '';
        for (let collectionLine of collectionLinesForBoardGame) {
          ownerString = ownerString + collectionLine.ownerUserName + "\n";
        }
        message.reply({ content: ownerString, flags: [ 4096 ]});
      }
    }
  }

  private async handleGamesCommand(message: Message) {
    if (this.isGamesCommand(message)) {
      const ownerString = message.content.slice(7);
      console.log(ownerString);
      if (!await this.doesOwnerExists(ownerString)) {
          message.reply({ content: "This user is not an owner of any boardgames", flags: [ 4096 ]});
      } else {
        let collectionLinesForOwner: CollectionLine[] = await this.gameService.retrieveLinesForOwner(ownerString);
        let boardgameString: string = '';
        for (let collectionLine of collectionLinesForOwner) {
          boardgameString = boardgameString + collectionLine.boardGameName + "\n";
        }
        message.reply({ content: boardgameString, flags: [ 4096 ]});
      }
    }
  }

  private async handleHelpCommand(message : Message) {
    if (this.isHelpCommand(message)) {
      message.reply({ content: "HELP HELP HELP, what are you trying to achieve?", flags: [ 4096 ]});
    }
  }

  private updateAtlasMessage(): void {
    this.atlasChannel.messages.fetch().then(async messages => {
      messages.first()?.delete();
      const atlasMessage: string = await this.generateAtlasMessage();
      if (atlasMessage.length != 0) {
        this.atlasChannel.send(atlasMessage);
      }
    });
  }

  private async doesOwnerExists(username: string) {
    const owner: Owner = await this.gameService.retrieveOwner(username);
    return owner != undefined && owner != null;
  }

  private async doesBoardGameExists(name: string) {
    const boardgame: BoardGame = await this.gameService.retrieveBoardGame(name);
    return boardgame != undefined && boardgame != null;
  }

  private async doesOwnerHaveGame(gameString: string, username: string): Promise<boolean> {
    const collectionLines: CollectionLine[] = await this.gameService.retrieveLinesForOwnerAndBoardGame(username, gameString);
    return collectionLines.length > 0;
  }

  private isTestCommand(message: Message) {
    return message.content.startsWith(Commands.TEST);
  }

  private isAddGameCommand(message: Message) {
    return message.content.startsWith(Commands.ADD_GAME);
  }

  private isOwnersCommand(message: Message) {
    return message.content.startsWith(Commands.OWNER);
  }

  private isGamesCommand(message: Message) {
    return message.content.startsWith(Commands.GAMES);
  }

  private isHelpCommand(message: Message) {
    return message.content.startsWith(Commands.HELP);
  }

  private isValidAtlasChannel(): boolean {
    return this.atlasChannel.messages != undefined && this.atlasChannel.messages != null;
  }

  private async generateAtlasMessage(): Promise<string> {
    let map: Map<string, string[]> = new Map<string, string[]>();
    let boardgames: BoardGame[] = await this.gameService.retrieveAllBoardGames();

    for (let boardgame of boardgames) {
      let collectionLinesForGame: CollectionLine[] = await this.gameService.retrieveLinesForBoardGame(boardgame.name);
      let owners: string[] = [];
      for (let collectionLine of collectionLinesForGame) {
        owners.push(collectionLine.ownerUserName);
      }
      map.set(boardgame.name, owners);
    }

    let sortedMap = new Map([...map.entries()].sort());
    let atlasMessage = '';

    for (let entry of sortedMap.entries()) {
      let boardGameLine = "### " + entry[0] + '\n';
      let authorLine = '';
      for (let username of entry[1]) {
        if (authorLine != '') {
          authorLine = authorLine + ", " + username;
        } else {
          authorLine = username;
        }
      }
      atlasMessage = atlasMessage + boardGameLine + authorLine + "\n";
    }

    return atlasMessage;
  }
}