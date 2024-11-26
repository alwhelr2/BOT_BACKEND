import { Collection } from "discord.js";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";

export default interface ICustomClient {
    token: string;
    id: string;
    commands: Collection< string, Command >;
    subCommands: Collection< string, SubCommand >;
    cooldowns: Collection< string, Collection< string, number > >;

    Init(): void;
}