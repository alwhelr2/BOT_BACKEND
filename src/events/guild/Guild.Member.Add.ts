import { ChannelType, Events, GuildMember, time, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { Guild, User } from "../../types";
import { calculateNumberSuffix } from "../../UtilityMethods";

export default class GuildMemberAdd extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.GuildMemberAdd,
            description: `Guild member add event`,
            once: false
        } )
    }

    async Execute( member: GuildMember ) {

        const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ member.guild.id }` );
        const channel = await member.guild.channels.fetch( guild.joinleavelogchannel ?? `` );

        if ( channel ) {

            const numberJoined = ( await this.client.guilds.fetch( member.guild.id ) ).memberCount;

            if ( channel.type === ChannelType.GuildText )
                await channel.send( {
                    embeds: [ {
                        title: `Member joined`,
                        description: `${ userMention( member.id ) } ${ calculateNumberSuffix( numberJoined ) } to join\ncreated ${ time( member.user.createdAt, "R" ) }`,
                        color: guild.themecolor,
                        timestamp: new Date().toISOString(),
                        author: {
                            name: member.user.username,
                            icon_url: member.displayAvatarURL()
                        },
                        footer: {
                            text: `ID: ${ member.id }`
                        }
                    } ]
                } );

        }

        try {

            await this.client.botAxios.post< User >( `/users`, {
                id: member.id,
                username: member.user.username,
                avatar: member.displayAvatarURL(),
                createdTimestamp: member.user.createdTimestamp,
            } );
            await this.client.botAxios.post( `/guild/${ member.guild.id }/user`, [ {
                id: member.id
            } ] );
            if ( guild.joinrole ) 
                await member.roles.add( member.guild.roles.cache.find( role => role.id === guild.joinrole )! )
            console.log( `User relationship added!`, {
                userid: member.id,
                guildid: member.guild.id
            } );

        } catch ( error ) {

            console.log( `Error adding guild member!`, error );

        }

        if ( this.client.guildUpdateLog )
            console.log( `Guild member ${ member.id } added to ${ member.guild.id }!` );

    }

}