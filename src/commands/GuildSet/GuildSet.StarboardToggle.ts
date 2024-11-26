import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetStarboardToggle extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.starboardtoggle`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        await interaction.deferReply();
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
            const newState = !guild.starboardenabled;
            
            await this.client.botAxios.patch( `/guild/${ interaction.guildId }`, {
                starboardenabled: newState ? 1 : 0
            } );
            void interaction.followUp( `Guild starboard toggled to ${ newState ? `on` : `off` }!` );

        } catch ( error ) {

            console.log( `Error toggling starboard!`, error );
            await interaction.followUp( {
                content: `Error toggling starboard!`,
                ephemeral: true
            } ); 

        }

    }

}