import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class EmbedBuild extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: "embed.build"
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {

        const author_name = interaction.options.getString( `author_name` );
        const author_icon_url = interaction.options.getString( `author_icon_url` );
        const author_url = interaction.options.getString( `author_url` );
        const title = interaction.options.getString( `title` );
        const color = interaction.options.getString( `color` );
        const embedColor = parseInt( color ?? `` ); 
        const footer_text = interaction.options.getString( `footer_text` );
        const footer_icon_url = interaction.options.getString( `footer_icon_url` );
        const thumbnail_url = interaction.options.getString( `thumbnail_url` );
        const description = interaction.options.getString( `description` );
        const image_url = interaction.options.getString( `image_url` );
        const timestamp = interaction.options.getBoolean( `timestamp` ) ?? false;
        const url = interaction.options.getString( `url` );

        const builtEmbed = {
            author: {
                name: author_name ?? ``,
                icon_url: author_icon_url ?? undefined,
                url: author_url ?? undefined,
            },
            title: title ?? undefined,
            color: Number.isNaN( color ) ? this.client.defaultGuildThemeColor : embedColor,
            footer: {
                text: footer_text ?? ``,
                icon_url: footer_icon_url?? undefined,
            },
            thumbnail: {
                url: thumbnail_url ?? ``
            },
            description: description ?? undefined,
            image: {
                url: image_url ?? ``
            },
            timestamp: timestamp ? new Date().toISOString() : undefined,
            url: url ?? undefined,
        }

        await interaction.deferReply( { ephemeral: true } );
        await interaction.deleteReply();
        
        if ( interaction.channel?.isSendable() ) await interaction.channel?.send( {
            embeds: [ builtEmbed ]
        } );
        
    }

}