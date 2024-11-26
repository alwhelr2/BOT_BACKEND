import { channelMention, ChannelType, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { getAllMessages } from "../../UtilityMethods";

export default class ModerationPurgeChannel extends SubCommand {

    constructor ( client: CustomClient ) {
        super( client, {
            name: `moderation.purgechannel`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        const channel = ( await ( await this.client.guilds.fetch( interaction.guildId ) ).channels.fetch( interaction.options.getChannel( `channel` )!.id ) )!;

        await interaction.deferReply( { ephemeral: true } );
        if ( channel.type === ChannelType.GuildText ) {

            const messages = [ ...await getAllMessages( channel ) ];
            for ( const message of messages ) await message.delete();
            await interaction.followUp( {
                content: `All messages in channel ${ channelMention( channel.id ) } deleted!`,
                ephemeral: true
            } );

        } else {

            await interaction.followUp( {
                content: `The channel provided was not a text channel!`,
                ephemeral: true
            } );

        }

    }

}