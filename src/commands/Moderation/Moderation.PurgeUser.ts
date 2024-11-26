import { channelMention, ChannelType, ChatInputCommandInteraction, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { getAllMessages } from "../../UtilityMethods";

export default class ModerationPurgeUser extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `moderation.purgeuser`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;

        const user = interaction.options.getUser( `user` )!;
        const channelId = interaction.options.getChannel( `channel` )?.id ?? interaction.channelId;
        const channel = ( await ( await this.client.guilds.fetch( interaction.guildId ) ).channels.fetch( channelId ) )!;

        await interaction.deferReply( { ephemeral: true } );
        if ( channel.type === ChannelType.GuildText ) {

            const messages = [ ...await getAllMessages( channel ) ].filter( ( message ) => message.author.id === user.id );
            for ( const message of messages ) await message.delete();
            await interaction.followUp( {
                content: `All messages from ${ userMention( user.id ) } in channel ${ channelMention( channel.id ) } deleted!`,
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