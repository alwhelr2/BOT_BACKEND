/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonInteraction, ChatInputCommandInteraction, Message, ModalSubmitInteraction } from "discord.js";
import ISubCommand from "../interfaces/ISubCommand";
import CustomClient from "./CustomClient";
import ISubCommandOptions from "../interfaces/ISubCommandOptions";

export default class SubCommand implements ISubCommand {
    client: CustomClient;
    name: string;

    constructor( client: CustomClient, options: ISubCommandOptions ) {
        this.client = client;
        this.name = options.name;
    }

    async Execute( interaction?: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | Message, aliasOptions?: object ): Promise<void> {
    }
    
}