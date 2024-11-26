import { ChannelType, Events, REST, Routes, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
// import Command from "../../base/classes/Command";
import * as emojikitchen from '../../../data/emojikitchen.json';
import { writeFileSync, readFileSync } from 'fs';
import { EmojiDictionary, Guild, GuildUser, User } from "../../types";
import { RecurrenceRule, scheduleJob } from "node-schedule";

export default class ClientReady extends Event {

    constructor( client:CustomClient ) {
        super( client, {
            name: Events.ClientReady,
            description: `Client ready event fired`,
            once: true
        } );
        
        try {

            this.client.emojiDictionary = JSON.parse( readFileSync( './data/emojiDictionary.json' ).toString() ) as EmojiDictionary;
            // console.log( `Emoji dictionary loaded!`, this.client.emojiDictionary );

        } catch ( error ) {

            console.log( `Error loading emoji dictionary, writing a replacement`, error );
            const { knownSupportedEmoji, data } = ( emojikitchen as { knownSupportedEmoji: string[], data: { [ index: string ]: { emoji: string, combinations: { leftEmojiCodepoint: string, rightEmojiCodepoint: string, leftEmoji: string, rightEmoji:string, date: string, gStaticUrl: string, alt: string }[] } } } );
            knownSupportedEmoji.forEach( ( emojiID: string ) => {

                const { emoji } = data[ emojiID ];
                const comboSet = new Set<string>();
                this.client.emojiDictionary[ emoji ] = { comboResults: {}, combos: [] };

                for ( const combo of data[ emojiID ].combinations ) {

                    const newEmoji = combo.leftEmojiCodepoint === emojiID ? combo.rightEmoji : combo.leftEmoji;
                    const oldDate = this.client.emojiDictionary[ emoji ].comboResults[ newEmoji ]?.date;
                    if ( !oldDate || oldDate < combo.date ) {

                        this.client.emojiDictionary[ emoji ].comboResults[ newEmoji ] = { url: combo.gStaticUrl, date: combo.date, alt: combo.alt };

                    }
                    comboSet.add( newEmoji );

                }
                this.client.emojiDictionary[ emoji ].combos.push( ...comboSet );

            } );
            writeFileSync( './data/emojiDictionary.json', JSON.stringify( this.client.emojiDictionary, null, '\t' ) );
            console.log( `New emoji dictionary file created.` );

        }

    }

    // private GetJson( commands: Collection< string, Command > ) {

    //     const data: object[] = [];
    //     commands.forEach( command => {

    //         data.push( {
    //             name: command.name,
    //             description: command.description,
    //             options: command.options,
    //             default_member_permissions: command.default_member_permissions?.toString(),
    //             dm_permission: command.dm_permission
    //         } );
    //     } );

    //     return data;

    // }

    private newDay = ( date: Date ) => {

        const month = date.toLocaleString( `default`, { month: `long` } );
        const day = date.getDate();
        console.log( `The day has changed, it is now ${ month } ${ day }` );
        
        ( async () => {

            const { data: users } = await this.client.botAxios.get< User[] >( '/users' );
            for ( const user of users ) {

                const { data: guilds } = await this.client.botAxios.get< Guild[] >( `/user/${ user.id }/guilds` );
                if ( user.birthdaymonth === month && user.birthdaydate === day ) {

                    if ( user.birthdayreminder ) {

                        const dUser = await this.client.users.fetch( user.id );
                        await dUser.send( {
                            content: `${ userMention( user.id ) }`,
                            embeds: [ {
                                title: `Happy Birthday!`,
                                description: `It's your birthday!`,
                                image: {
                                    url: `https://cdn.discordapp.com/attachments/1195575685213863968/1293206989303976098/happy-birthday.gif?ex=6706885c&is=670536dc&hm=494bbac13f16b2c7a52a113258dd5c14385618228703f539b887f0b5425fcbfb&`
                                },
                                color: this.client.defaultGuildThemeColor
                            } ]
                        } );

                    }
                    for ( const guild of guilds ) {

                        const { data: guilduser } = await this.client.botAxios.get< GuildUser >( `/guild/${ guild.id }/user/${ user.id }` );

                        if ( guild.birthdaychannel && guilduser.birthdayreminder ) {

                            const discordGuild = await this.client.guilds.fetch( guild.id );
                            const channel = ( await discordGuild.channels.fetch( guild.birthdaychannel ) )!;

                            if ( channel.type === ChannelType.GuildText ) {

                                await channel.send( {
                                    content: `${ userMention( user.id ) }`,
                                    embeds: [ {
                                        title: `Happy Birthday!`,
                                        description: `It's ${ userMention( user.id ) }s birthday!`,
                                        image: {
                                            url: `https://cdn.discordapp.com/attachments/1195575685213863968/1293206989303976098/happy-birthday.gif?ex=6706885c&is=670536dc&hm=494bbac13f16b2c7a52a113258dd5c14385618228703f539b887f0b5425fcbfb&`
                                        },
                                        color: guild.themecolor
                                    } ]
                                } );

                            }

                        }

                    }

                }

            }

        } )().catch( ( error ) => {

            console.log( `Error sending birthday message!`, error );

        } );

    };

    async Execute() {

        // const commands: object[] = this.GetJson( this.client.commands );
        const rest = new REST().setToken( this.client.token );

        await rest.put( Routes.applicationCommands( this.client.id ), {
            body: this.client.commands.map( ( command ) => {
                return {
                    name: command.name,
                    description: command.description,
                    options: command.options,
                    default_member_permissions: command.default_member_permissions?.toString(),
                    dm_permission: command.dm_permission
                };
            } )
        } );
        console.log( `${ this.client.user?.tag } is now ready!\nLoading and saving user and guild data...` );
        await this.client.LoadGuildsAndMembers();
        console.log( 'User and guild information updated and saved!' );

        const date = new Date();
        const month = date.toLocaleString( `default`, { month: `long` } );
        const day = date.getDate();
        const secondsUntilEndOfDay = -3600 * date.getHours() - 60 * date.getMinutes() - date.getSeconds() + 86400;
        console.log( `The date is currently ${ month } ${ day }, there are ${ secondsUntilEndOfDay } seconds remaining in the day.` );
        // scheduleJob( '1s', '* * * * * *', function() {
        //     console.log( '1s' );
        // } );
        scheduleJob( new RecurrenceRule( undefined, undefined, undefined, undefined, 0, 0, undefined, 'Etc/CST' ), this.newDay );
        // console.log( 'Next planned job invocation', job.nextInvocation() );
        // scheduleJob( { hour: 16, minute: 34, tz: 'Etc/CST' }, this.newDay );
        // setTimeout( this.newDay, ( secondsUntilEndOfDay + 10 ) * 1000 );

    }

}