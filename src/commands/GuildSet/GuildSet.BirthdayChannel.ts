import { channelMention, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild } from "../../types";

export default class GuildSetBirthdayChannel extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `guildset.birthdaychannel`
        } )
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const channel = interaction.options.getChannel( `channel` )!;
        await interaction.deferReply();

        try {

            const { data: guild } = await this.client.botAxios.patch< Guild >( `/guild/${ interaction.guildId }`, {
                birthdaychannel: channel.id
            } );
            await interaction.followUp( {
                embeds: [ {
                    description: `The birthday channel for the guild has been set to ${ channelMention( channel.id ) }!`,
                    color: guild.themecolor
                } ]
            } );

        } catch ( error ) {

            console.log( `Error updating guild!`, error );

        }

    }

}