import { AtlasCommand } from "./AtlasCommand";
import { RebootCommand } from "./RebootCommand";
import { Command } from "./Command";

export const Commands: Command[] = [
    AtlasCommand,
    RebootCommand
];