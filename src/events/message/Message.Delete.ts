import { ChannelType, Events, Message } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { Guild } from "../../types";

export default class MessageDelete extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.MessageDelete,
            description: `Message delete event`,
            once: false
        } )
    }

    async Execute( message: Message ) {

        if ( !message.inGuild() ) return;

        const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ message.guildId }` );
        const channel = await this.client.channels.fetch( guild.messagelogchannel ?? `` );        

        if ( channel?.type === ChannelType.GuildText && message.content?.length > 0 ) {

            try {
                await channel.send( {
                    embeds: [
                        {
                            author: {
                                name: message.author.username,
                                icon_url: message.author.displayAvatarURL()
                            },
                            title: `Message deleted in #${ message.channel.name }`,
                            description: `${ message.content }\n\nMessage ID: ${ message.id }`,
                            color: guild.themecolor,
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: `ID: ${ message.author.id }`
                            }
                        }
                    ]
                } );

            } catch ( error ) {

                console.log( `Error sending logging embed!`, error );

            }

        }

    }

}