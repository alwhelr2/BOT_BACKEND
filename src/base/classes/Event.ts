/* eslint-disable @typescript-eslint/no-unused-vars */
import { Events } from "discord.js";
import IEvent from "../interfaces/IEvent";
import CustomClient from "./CustomClient";
import IEventOptions from "../interfaces/IEventOptions";

export default class Event implements IEvent {
    client: CustomClient;
    name: Events;
    description: string;
    once: boolean;

    constructor( client: CustomClient, options: IEventOptions ) { 
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Execute( ...args: any ): void {}

}