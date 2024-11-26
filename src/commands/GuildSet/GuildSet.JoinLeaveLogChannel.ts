import { ChatInputCommandInteraction, channelMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetJoinLeaveLogChannel extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: "guildset.joinleavelogchannel"
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const channel = interaction.options.getChannel( 'channel' )!;

        try {

            const { data: guild } = await this.client.botAxios.patch< Guild >( `/guild/${ interaction.guildId }`, {
                joinleavelogchannel: channel.id
            } );
            await interaction.reply( {
                embeds: [ {
                    description: `The join/leave log channel has been set to ${ channelMention( channel.id ) }!`,
                    color: guild.themecolor
                } ]
            } );

        }  catch ( error ) {

            console.log( `Error updating guild!`, error );

        }

    }

}