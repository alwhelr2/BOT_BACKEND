import { APIEmbed, channelMention, ChannelType, Events, formatEmoji, Message, parseEmoji, PermissionsBitField, resolvePartialEmoji, roleMention, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { getCustomEmojis, rng } from "../../UtilityMethods";
import { Guild, Trigger, User } from "../../types";
import TriggerType from "../../base/enums/TriggerType";
import Pagination from "../../base/classes/Pagination";

export default class MessageCreate extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.MessageCreate,
            description: `Message create event`,
            once: false
        } )
    }

    async Execute( message: Message ) {

        if ( message.author.id === this.client.id ) return;

        let guildColor = this.client.defaultGuildThemeColor;
        let guildCommandPrefix = this.client.defaultCommandAlias;
        const guild = await message.guild?.fetch();
        const member = await guild?.members.fetch( message.author.id );
        const triggers = [];
        try {

            // await this.client.botAxios.get( `/user/${ message.author.id }` );
            await this.client.botAxios.post< User >( `/users`, {
                id: message.author.id,
                username: message.author.username,
                avatar: message.author.displayAvatarURL()
            } );
            if ( message.inGuild() )
                await this.client.botAxios.post( `/guild/${ message.guild.id }/user`, [ {
                    id: message.author.id
                } ] );

        } catch ( error ) { /* console.log( `Error adding user to db, user already exists!`, error ); */ }

        try {

            const { data: trigs } = await this.client.botAxios.get< Trigger[] >( message.inGuild() ? `/guild/${ message.guildId }/triggers` : '/dmtriggers' );
            triggers.push( ...trigs );
            if ( message.inGuild() ) {

                const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ message.guildId }` );
                guildColor = guild.themecolor;
                guildCommandPrefix = guild.commandalias;

            }

        } catch ( error ) {

            console.log( `Error fetching triggers!`, error );

        }

        const messageText = message.content.trim();
        const args = messageText.split( ' ' );
        const commandPrefix = args?.[ 0 ]?.[ 0 ];
        const commandNameFull = args.shift() ?? ``;
        const commandName = commandNameFull.substring( 1 );
        const repliedTo = await message.fetchReference().catch( () => {} );
        const repliedToMessage = repliedTo instanceof Message;

        if ( commandPrefix === guildCommandPrefix ) {

            if ( !message.inGuild() || member!.permissions.has( PermissionsBitField.Flags.ModerateMembers ) ) {

                // console.log( `Command Prefix: ${ commandPrefix }, Command Name: ${ commandName }` );
                // console.log( `Command Args:`, args );
                switch ( commandName ) {

                    case 'printChannels': {
                        if ( !message.inGuild() ) break;
                        const channels = ( await guild!.channels.fetch() ).filter( ( channel ) => channel!.type === ChannelType.GuildText );
                        const pageDescriptions = [];
                        for ( let i = 0; i < channels.size; i += 5 ) {

                            let line = ``;
                            for ( let j = 0; j < 5; j++ ) {

                                if ( ( i + j ) < channels.size ) {

                                    line += `${ channelMention( channels.at( i + j )!.id ) }`;
                                    if ( j < 4 ) line += `\n`;

                                } else break;

                            }
                            pageDescriptions.push( line );

                        }
                        const embeds: APIEmbed[] = pageDescriptions.map( ( description ) => {

                            return {
                                title: `Channels:`,
                                description: description,
                                color: guildColor
                            };

                        } );
                        await new Pagination( embeds, undefined, message ).DisplayEmbedPagination();
                        break;
                    }
                    case `printGuildSettings`: {
                        if ( !message.inGuild() ) break;
                        const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ message.guildId }` );
                        const fields: { name: string, value: string, inline?: boolean }[] = [
                            { name: `Owner`, value: `${ userMention( guild.owner ) }` },
                            { name: `Starboard enabled`, value: `${ guild.starboardenabled }`, inline: true },
                            { name: `Theme color`, value: `#${ guildColor.toString( 16 ) }`, inline: true },
                            { name: `Command alias`, value: `${ guildCommandPrefix }`, inline: true },
                        ];
                        if ( guild.joinrole )
                            fields.push( {
                                name: `Join role`,
                                value: `${ roleMention( guild.joinrole ) }`
                            } );
                        if ( guild.starboardchannel ) {
                            fields.push( { name: `Starboard channel`, value: `${ channelMention( guild.starboardchannel ) }`, inline: true } );
                            fields.push( { name: `Starboard limit`, value: `${ guild.starboardlimit }`, inline: true } );
                            fields.push( { name: `Starboard self star`, value: `${ guild.starboardselfstar }`, inline: true } );
                        }
                        if ( guild.joinleavelogchannel ) 
                            fields.push( {
                                name: `Join/leave log channel`,
                                value: `${ channelMention( guild.joinleavelogchannel ) }`
                            } );
                        if ( guild.messagelogchannel )
                            fields.push( {
                                name: `Message log channel`,
                                value: `${ channelMention( guild.messagelogchannel ) }`
                            } );
                        if ( guild.birthdaychannel )
                            fields.push( {
                                name: `Birthday channel`,
                                value: `${ channelMention( guild.birthdaychannel ) }`
                            } );
                        await message.reply( {
                            embeds: [ {
                                title: `Guild Settings:`,
                                color: guildColor,
                                thumbnail: {
                                    url: `${ guild.iconURL }`
                                },
                                fields: fields
                            } ]
                        } );
                        break;
                    }
                    case `printUserSettings`: {
                        if ( !message.inGuild() ) break;
                        const { data: guildUsers } = await this.client.botAxios.get< User [] >( `/guild/${ message.guildId }/users` );
                        const embeds: APIEmbed[] = guildUsers.map( ( user ) => {

                            const fields = [
                                { name: `Created At`, value: `${ new Date( parseInt( user.createdTimestamp.toString() ) ).toString() }` },
                            ];
                            if ( user.birthdaydate && user.birthdaymonth )
                                fields.push(
                                    { name: `Birthday`, value: `${ user.birthdaymonth } ${ user.birthdaydate }` }
                                );
                            if ( !user.mybot )
                                fields.push(
                                    { name: `Bot`, value: `${ user.bot }` }
                                );
                            else
                                fields.push(
                                    { name: `Custom Bot`, value: `${ user.mybot }` }
                                );
                            return {
                                fields: fields,
                                author: {
                                    name: `${ user.username }`,
                                    icon_url: `${ user.avatar }`
                                },
                                color: guildColor
                            };

                        } );
                        await new Pagination( embeds, undefined, message ).DisplayEmbedPagination();
                        break;
                    }
                    case `glittertext`: {
                        if ( args.length > 0 )
                            await this.client.commands.get( `glittertext` )!.Execute( message, {
                                text: args.join( ' ' )
                            } );
                        else if ( repliedToMessage ) {

                            await this.client.commands.get( `glittertext` )!.Execute( message, {
                                text: repliedTo.content
                            } );

                        }
                        break;
                    }
                    case `printUsers`: {
                        if ( !message.inGuild() ) break;
                        const guildMembers = await ( await this.client.guilds.fetch( message.guildId ) ).members.fetch();
                        const pageDescriptions = [];
                        for ( let i = 0; i < guildMembers.size; i += 5 ) {

                            let line = ``;
                            for ( let j = 0; j < 5; j++ ) {

                                if ( ( i + j ) < guildMembers.size ) {

                                    line += `${ userMention( guildMembers.at( i + j )!.id ) }`;
                                    if ( j < 4 ) line += `\n`;

                                } else break;

                            }
                            pageDescriptions.push( line );

                        }
                        const embeds: APIEmbed[] = pageDescriptions.map( ( description ) => {

                            return {
                                title: `${ message.guild.name } Members:`,
                                description: description,
                                color: guildColor
                            };

                        } );
                        await new Pagination( embeds, undefined, message ).DisplayEmbedPagination();
                        break;
                    }
                    case `printAliasCommands`: {

                        const commands = [ ...this.Execute.toString().matchAll( /case ('|`)(?<command>\w+)('|`)/gu ) ].map( ( match ) => match.groups!.command );
                        const pageDescriptions = [];
                        for ( let i = 0; i < commands.length; i += 5 ) {

                            let line = ``;
                            for ( let j = 0; j < 5; j++ ) {

                                if ( ( i + j ) < commands.length ) {

                                    line += `${ commands[ i + j ] }`;
                                    if ( j < 4 ) line += `\n`;

                                } else break;

                            }
                            pageDescriptions.push( line );

                        }
                        const embeds: APIEmbed[] = pageDescriptions.map( ( description ) => {

                            return {
                                title: `Alias Commands:`,
                                description: description,
                                color: guildColor
                            };

                        } );
                        await new Pagination( embeds, undefined, message ).DisplayEmbedPagination();
                        break;
                    }
                    case `intimidate`: {
                        const result = [ ...getCustomEmojis( args[ 0 ] ?? ( repliedToMessage ? repliedTo.content : `` ) ) ].find( ( result ) => parseEmoji( result[ 0 ] )?.id );
                        const emoji = result ? parseEmoji( result[ 0 ] ) : undefined;
                        const leftGun = this.client.emojis.cache.get( `1201844220772753470` ), rightGun = this.client.emojis.cache.get( `1201844219652603936` );
                        if ( emoji ) {

                            const resolvedEmoji = this.client.emojis.cache.get( emoji.id! );
                            if ( !resolvedEmoji ) {

                                try {

                                    const newEmoji = await this.client.application!.emojis.create( {
                                        attachment: `https://cdn.discordapp.com/emojis/${ emoji.id }.${ emoji.animated ? `gif` : `webp` }?size=96&quality=lossless`,
                                        name: `${ emoji.name  }`
                                    } );
                                    await message.reply( `${ leftGun }${ newEmoji }${ rightGun }` );
                                    await newEmoji.delete();

                                } catch ( error ) {

                                    console.log( `Error creating new application emoji!`, error );

                                }
                                break;

                            }
                            await message.reply( `${ leftGun }${ formatEmoji( emoji.id!, emoji.animated ) }${ rightGun }` );

                        } else await message.reply( `Please specify an emoji!` );
                    }
                    default:
                        break;

                }
            } else await message.reply( `You don't have the proper permissions to use alias commands.` );

        }
        
        if ( this.client.guildUpdateLog )
            console.log( `Member ${ message.author.id }#${ message.author.displayName } sent a message \`${ message.content }\` in ${ message.inGuild() ? `${ message.guild.name }#${ message.channel.name }` : `DMS.` }` );
        triggers.forEach( ( trigger: Trigger ) => {
            if ( ( ( trigger.type === TriggerType.Normal && messageText.toLowerCase().includes( trigger.text ) ) || ( trigger.type === TriggerType.Strict && messageText.toLowerCase().match( new RegExp( `\\b${ trigger.text }\\b` ) ) ) || ( trigger.type === TriggerType.Exact && messageText.toLowerCase() === trigger.text ) || ( trigger.type === TriggerType.StartsWith && messageText.toLowerCase().indexOf( trigger.text ) === 0 ) || ( trigger.type === TriggerType.EndsWith && messageText.toLowerCase().endsWith( trigger.text ) ) )
                && ( trigger.triggerbyuser === message.author.id || !trigger.triggerbyuser ) 
                && trigger.enabled && rng( trigger.chance )
                && ( ( !trigger.guildid && !message.inGuild() ) || ( message.inGuild() && trigger.guildid === message.guildId ) )
                && ( trigger.channelid === message.channelId || !trigger.channelid ) )
                void message.reply( trigger.response );
        } );

    }

}