import {Command} from "./Command";
import {AtlasCommand} from "./AtlasCommand";
import {RebootCommand} from "./RebootCommand";
import {AddGameCommand} from "./AddGameCommand";
import {RemoveGameCommand} from "./RemoveGameCommand";
import {GamesCommand} from "./GamesCommand";
import {OwnersCommand} from "./OwnersCommand";
import {AutoCompletableCommand} from "./AutoCompletableCommand";

export const Commands: Command[] = [
    AtlasCommand,
    RebootCommand,
    AddGameCommand,
    RemoveGameCommand,
    GamesCommand,
    OwnersCommand
];

export const AutoCompletableCommands: AutoCompletableCommand[] = [
    AddGameCommand
]