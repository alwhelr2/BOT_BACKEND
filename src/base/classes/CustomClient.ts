/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client, Collection, GatewayIntentBits, Partials, Guild as djGuild } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import Command from "./Command";
import SubCommand from "./SubCommand";
import Handler from "./Handler";
import { config } from 'dotenv';
import Graphemer from "graphemer";
import axios, { AxiosInstance } from 'axios';
import { EmojiDictionary, Guild, User } from "../../types";
import { getDefaultAvatarColor } from "../../UtilityMethods";

export default class CustomClient extends Client implements ICustomClient {

    token: string;
    id: string;
    handler: Handler;
    commands: Collection< string, Command >;
    subCommands: Collection< string, SubCommand >;
    cooldowns: Collection< string, Collection< string, number > >;
    defaultCommandAlias: string;
    defaultGuildThemeColor: number;
    splitter = new Graphemer();
    emojiDictionary: EmojiDictionary = {};
    botAxios: AxiosInstance = axios.create( { baseURL: 'https://adrianwheeler.tech' } );
    userUpdateLog: boolean = false;
    debugLog: boolean = false;
    guildUpdateLog: boolean = false;

    constructor() {
        super( { 
            intents: [ 
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.GuildModeration
            ], 
            partials: [
                Partials.Message,
                Partials.Reaction,
                Partials.Channel,
                Partials.User,
                Partials.GuildMember
            ] 
        } );
        config( { path: `./data/.env` } );
        this.token = process.env.CLIENT_TOKEN_BRUHBRO!;
        this.id = process.env.CLIENT_ID_BRUHBRO!;
        this.handler = new Handler( this );
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
        this.defaultCommandAlias = "!";
        this.defaultGuildThemeColor = parseInt( "#0750aa".substring( 1 ), 16 );
    }

    async LoadHandlers(): Promise< void > {
        
        await this.handler.LoadEvents().catch( console.error );
        await this.handler.LoadCommands().catch( console.error );
        
    }

    Init(): void {

        this.LoadHandlers().then( () => {

            this.login( this.token ).catch( console.error );

        } ).catch( console.error );

    }

    async LoadGuildsAndMembers() {

        const fetchedGuilds = [ ...( await this.guilds.fetch() ).values() ];
        const { data: dbGuilds } = await this.botAxios.get< Guild[] >( '/guilds' );
        const { data: users } = await this.botAxios.get< User[] >( '/users' );
        for ( const guild of fetchedGuilds ) {

            const fetchedGuild = await guild.fetch();
            const tableRows = await this.LoadGuildMembers( fetchedGuild );
            await this.botAxios.post( '/guilds', {
                id: fetchedGuild.id,
                name: fetchedGuild.name,
                iconURL: fetchedGuild.iconURL(),
                owner: fetchedGuild.ownerId
            } );
            const { data: savedGuild } = await this.botAxios.get< Guild >( `/guild/${ fetchedGuild.id }` );
            await this.botAxios.post( `/guild/${ fetchedGuild.id }/user`, tableRows );

        }

    }

    private async LoadGuildMembers( fetchedGuild: djGuild ) {

        const userIds: { id: string }[] = [];
        for ( const member of [ ...( await fetchedGuild.members.fetch() ).values() ] ) {

            const user = await member.user.fetch();
            const userData = {
                id: member.id,
                username: user.displayName,
                avatar: member.displayAvatarURL(),
                bot: user.bot,
                createdTimestamp: user.createdTimestamp,
                banner: user.bannerURL() ?? user.accentColor ?? getDefaultAvatarColor( user.displayAvatarURL() ),
                mybot: user.id === this.user?.id,
            };
            if ( ( member.presence?.activities.length ?? 0 ) > 0 && member.presence!.activities[ 0 ].name === `Custom Status` && member.presence!.activities[ 0 ].state ) ( userData as User ).status = member.presence!.activities[ 0 ].state;
            const { data: createUser } = await this.botAxios.post< User >( `/users`, userData );
            userIds.push( {
                id: member.id
            } );

        }
        return userIds;

    }

}