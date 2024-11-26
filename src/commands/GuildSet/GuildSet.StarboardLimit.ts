import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetStarboardLimit extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.starboardlimit`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const limit = interaction.options.getInteger( `limit` )!;

        try {

            const { data: guild } = await this.client.botAxios.patch< Guild >( `/guild/${ interaction.guildId }`, {
                starboardlimit: limit
            } );
            await interaction.reply( {
                embeds: [ {
                    description: `The starboard limit has been set to ${ limit }!`,
                    color: guild.themecolor
                } ]
            } );

        }  catch ( error ) {

            console.log( `Error updating guild!`, error );

        }

    }

}