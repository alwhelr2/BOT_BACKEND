import { ChatInputCommandInteraction, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetJoinRole extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.joinrole`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const role = interaction.options.getRole( 'role' )!;

        try {

            const { data: guild } = await this.client.botAxios.patch< Guild >( `/guild/${ interaction.guildId }`, {
                joinrole: role.id
            } );
            await interaction.reply( {
                embeds: [ {
                    description: `The join role for the guild has been set to ${ roleMention( role.id ) }!`,
                    color: guild.themecolor
                } ]
            } );

        } catch ( error ) {

            console.log( `Error updating guild!`, error );

        }

    }

}