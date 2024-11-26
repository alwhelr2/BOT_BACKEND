import { ChannelType, Events, MessageReaction, User, channelMention, hyperlink, parseEmoji } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { Guild, ReactionRole } from "../../types";

export default class MessageReactionAdd extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.MessageReactionAdd,
            description: `Message reaction add event`,
            once: false
        } )
    }

    async Execute( messageReaction: MessageReaction, user: User ) {

        const emojiString = `${ !messageReaction.emoji.id ? messageReaction.emoji.name : `${ messageReaction.emoji.animated ? `<a:${ messageReaction.emoji.name }:${ messageReaction.emoji.id }>`: `<:${ messageReaction.emoji.name }:${ messageReaction.emoji.id }>` }` }`;
        if ( this.client.guildUpdateLog )
            console.log( `User ${ user.id } added reaction ${ emojiString } to message in ${ messageReaction.message.inGuild() ? `${ messageReaction.message.guild.name }#${ messageReaction.message.channel.name }` : `DMs` }!` );
        if ( !messageReaction.message.inGuild() || user.id === this.client.id ) return;
        const member = messageReaction.message.guild.members.cache.get( user.id )!;
        const message = await messageReaction.message.fetch();

        const emoji = parseEmoji( emojiString );
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ message.guildId }` );
            if ( guild.starboardenabled && guild.starboardchannel && emoji?.name === '⭐' && ( guild.starboardselfstar || user.id !== message.author.id ) ) {

                const channel = ( await ( await this.client.guilds.fetch( message.guildId ) ).channels.fetch( guild.starboardchannel ) )!;
                if ( channel.type === ChannelType.GuildText ) {

                    const starReact = message.reactions.cache.find( ( reaction ) => reaction.emoji.name! === '⭐' )!;
                    const reactUsers = await starReact.users.fetch();
                    const reactCount = guild.starboardselfstar ? starReact.count : reactUsers.some( ( reactUser ) => reactUser.id === message.author.id ) ? starReact.count - 1 : starReact.count;

                    if ( reactCount >= guild.starboardlimit ) {

                        let found = false;
                        let last_id;

                        while ( true ) {

                            const options = { limit: 100 };
                            if ( last_id ) ( options as any ).before = last_id;

                            const messages = await channel.messages.fetch( options );

                            for ( const msg of [ ...messages.values() ] ) {

                                if ( msg.embeds[ 0 ].footer?.text === message.id ) {

                                    await msg.edit( {
                                        content: `⭐${ reactCount > 1 ? ` ${ reactCount }` : `` } ${ channelMention( message.channelId ) }`
                                    } );
                                    found = true;
                                    break;

                                }

                            }

                            last_id = messages.last()?.id;
                            if ( messages.size !== 100 || found ) break;

                        }

                        if ( !found ) {

                            await channel.send( {
                                content: `⭐${ reactCount > 1 ? ` ${ reactCount }` : `` } ${ channelMention( message.channelId ) }`,
                                embeds: [ {
                                    author: {
                                        name: `${ message.author.displayName }`,
                                        icon_url: `${ message.author.displayAvatarURL() }`
                                    },
                                    image: message.attachments.size > 0 && message.attachments.some( ( attachment ) => attachment.contentType?.startsWith( `image/` ) ) ? {
                                        url: message.attachments.find( ( attachment ) => attachment.contentType?.startsWith( `image/` ) )!.url
                                    } : undefined,
                                    description: `${ message.content }`,
                                    fields: [
                                        { name: `Source`, value: `${ hyperlink( `Jump!`, `https://discord.com/channels/${ guild.id }/${ message.channelId }/${ message.id }` ) }`, inline: true }
                                    ],
                                    footer: {
                                        text: `${ message.id }`
                                    },
                                    timestamp: new Date().toISOString(),
                                    color: guild.themecolor
                                } ]
                            } );

                        }

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

                await member.roles.add( role );
                if ( reactionRole.uniquereact ) {

                    const existingReactions = message.reactions.cache.filter( ( reaction ) => reaction.count > 1 && ( reaction.emoji.id! !== messageReaction.emoji.id! || reaction.emoji.name! !== messageReaction.emoji.name! ) ).values();
                    for ( const reaction of existingReactions ) {

                        const reactionUsers = reaction.count > reaction.users.cache.size ? await reaction.users.fetch() : reaction.users.cache;
                        if ( reactionUsers.has( user.id ) ) {

                            await reaction.users.remove( user.id );
                            break;

                        }

                    }
        
                }

            }

        } catch ( error ) {

            // console.log( `Error applying reaction roles!`, error ); 

        }
    
    }

}