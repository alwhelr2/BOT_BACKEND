import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetStarboardSelfStarToggle extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.starboardselfstartoggle`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        await interaction.deferReply();
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
            const newState = !guild.starboardselfstar;
            
            await this.client.botAxios.patch( `/guild/${ interaction.guildId }`, {
                starboardselfstar: newState ? 1 : 0
            } );
            void interaction.followUp( `Guild starboard self star toggled to ${ newState ? `on` : `off` }!` );

        } catch ( error ) {

            console.log( `Error toggling starboard self star!`, error );
            await interaction.followUp( {
                content: `Error toggling starboard self star!`,
                ephemeral: true
            } ); 

        }

    }

}