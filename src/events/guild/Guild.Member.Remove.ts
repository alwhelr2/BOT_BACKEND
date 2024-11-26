import { ChannelType, Events, GuildMember, time, userMention, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { Guild } from "../../types";

export default class GuildMemberRemove extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.GuildMemberRemove,
            description: `Guild member remove event`,
            once: false
        } )
    }

    async Execute( member: GuildMember ) {

        const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ member.guild.id }` );
        const channel = await member.guild.channels.fetch( guild.joinleavelogchannel ?? `` );
        const everyoneRole = this.client.guilds.cache.get( member.guild.id )?.roles.everyone;

        if ( channel ) {
            if ( channel.type === ChannelType.GuildText )
                await channel.send( {
                    embeds: [ {
                        title: `Member left`,
                        description: `${ userMention( member.id ) } joined ${ time( member.joinedAt!, "R" ) }\n**Roles:** ${ [ ...member.roles.cache.values() ].filter( ( role ) => role.id !== everyoneRole?.id ).map( ( role ) => `${ roleMention( role.id ) }` ).join( ` ` ) }`,
                        color: guild.themecolor,
                        author: {
                            name: `${ member.user.username }`,
                            icon_url: member.displayAvatarURL()
                        },
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `ID: ${ member.id }`
                        }
                    } ]
                } );
        }

        try {

            await this.client.botAxios.delete( `/guild/${ member.guild.id }/user/${ member.id }` );
            console.log( `User relationship removed!`, {
                userid: member.id,
                guildid: member.guild.id
            } );

        } catch ( error ) {

            console.log( `Error removing guild member!`, error );

        }

        if ( this.client.guildUpdateLog )
            console.log( `Guild member ${ member.id } removed from ${ member.guild.id }!` );

    }

}