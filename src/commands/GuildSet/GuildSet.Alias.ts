import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetAlias extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.alias`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        const alias = interaction.options.getString( 'alias' )!;

        try {

            const { data: guild } = await this.client.botAxios.patch< Guild >( `/guild/${ interaction.guildId }`, {
                commandalias: alias
            } );
            await interaction.reply( {
                embeds: [ {
                    description: `The command alias for the guild has been set to \`${ alias }\`!`,
                    color:  guild.themecolor
                } ]
            } );

        }  catch ( error ) {

            console.log( `Error updating guild!`, error );

        }

    }

}