import { ChannelType, Events, MessageReaction, User, channelMention, parseEmoji } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { AxiosError } from "axios";
import { Guild, ReactionRole } from "../../types";

export default class MessageReactionRemove extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.MessageReactionRemove,
            description: `Message reaction remove event`,
            once: false
        } );
    }

    async Execute( messageReaction: MessageReaction, user: User ) {

        const emojiString = `${ !messageReaction.emoji.id ? messageReaction.emoji.name : `${ messageReaction.emoji.animated ? `<a:${ messageReaction.emoji.name }:${ messageReaction.emoji.id }>`: `<:${ messageReaction.emoji.name }:${ messageReaction.emoji.id }>` }` }`;
        if ( this.client.guildUpdateLog )
            console.log( `User ${ user.id } removed reaction ${ emojiString } to message in ${ messageReaction.message.inGuild() ? `${ messageReaction.message.guild.name }#${ messageReaction.message.channel.name }` : `DMs` }!` );
        if ( !messageReaction.message.inGuild() ) return;
        const member = messageReaction.message.guild.members.cache.get( user.id )!;
        const message = await messageReaction.message.fetch();

        const emoji = parseEmoji( emojiString );
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ message.guildId }` );
            if ( guild.starboardenabled && guild.starboardchannel && emoji?.name === '⭐' && ( guild.starboardselfstar || message.author.id !== user.id ) ) {

                const channel = ( await ( await this.client.guilds.fetch( message.guildId ) ).channels.fetch( guild.starboardchannel ) )!;
                if ( channel.type === ChannelType.GuildText ) {

                    let found = false;
                    let last_id;

                    while ( true ) {

                        const options = { limit: 100 };
                        if ( last_id ) ( options as any ).before = last_id;

                        const messages = await channel.messages.fetch( options );

                        for ( const msg of [ ...messages.values() ] ) {

                            if ( msg.embeds[ 0 ].footer?.text === message.id ) {

                                const matches = [ ...msg.content.matchAll( /⭐ (?<num>\d*)\s*<#\d{17,19}>/gu ) ];
                                for ( const match of matches ) {

                                    const number = parseInt( match.groups?.num !== `` ? match.groups!.num : `1` ) - 1;''
                                    if ( number === 0 ) {

                                        await msg.delete();

                                    } else {

                                        await msg.edit( {
                                            content: `⭐${ number > 1 ? ` ${ number }` : `` } ${ channelMention( message.channelId ) }`
                                        } );

                                    }

                                }
                                found = true;
                                break;

                            }

                        }

                        last_id = messages.last()?.id;
                        if ( messages.size !== 100 || found ) break;

                    }

                }

            }

        } catch ( error ) {

            console.log( `Starboard error!`, error );

        }
        try {

            const { data: reactionRole } = await this.client.botAxios.get< ReactionRole >( `/guild/${ messageReaction.message.guildId }/reactionrole/message/${ messageReaction.message.id }/emoji/${ emoji?.id ?? emoji?.name }` );
            const role = messageReaction.message.guild.roles.cache.get( reactionRole.roleid );
            if ( role ) {

                await member.roles.remove( role );

            }

        } catch ( error ) {

            // console.log( `Error removing reaction roles!`, error );

        }

    }

}