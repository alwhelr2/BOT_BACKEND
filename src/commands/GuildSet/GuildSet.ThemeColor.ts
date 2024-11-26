import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class GuildSetThemeColor extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'guildset.themecolor'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const color = parseInt( interaction.options.getString( `color` )! );
        const invalidColor = Number.isNaN( color );
        
        if ( invalidColor ) {

            await interaction.reply( {
                content: `Invalid color provided`,
                ephemeral: true
            } );

        } else {

            try {

                await this.client.botAxios.patch( `/guild/${ interaction.guildId }`, {
                    themecolor: color
                } );
                await interaction.reply( {
                    embeds: [ {
                        title: `Theme color set!`,
                        color: color
                    } ]
                } );
    
            }  catch ( error ) {
    
                console.log( `Error updating guild!`, error );
    
            }

        }

    }

}