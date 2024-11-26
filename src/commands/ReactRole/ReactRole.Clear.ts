import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { getCustomEmojis } from "../../UtilityMethods";

export default class ReactRoleClear extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'reactrole.clear'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        // await interaction.reply( { content: 'This command is not yet implemented!', ephemeral: true } );
        await interaction.deferReply( { ephemeral: true } );

        const message_id = interaction.options.getString( `message_id` )!;
        const emoji = interaction.options.getString( `emoji` )!;
        const customEmoji = [ ...emoji.matchAll( /<a?:(\w|_)*:(?<custom_emoji>\d{17,19})>/g ) ][ 0 ]?.groups?.custom_emoji;
        const message = await interaction.channel?.messages.fetch( message_id );

        if ( !message ) {

            await interaction.followUp( { content: 'Message not found!', ephemeral: true } );
            return;

        }

        try {

            await this.client.botAxios.delete( `/reactionrole/guild/${ interaction.guildId }/message/${ message_id }/emoji/${ customEmoji ?? emoji }` );
            await message.reactions.cache.find( ( reaction ) => customEmoji ? reaction.emoji.id === customEmoji : reaction.emoji.name === emoji )?.remove();
            await interaction.followUp( `Deleted reaction role from message!` );

        } catch ( error ) {

            console.log( `Error clearing reactrole!` );
            await interaction.followUp( {
                content: `Failed to delete reaction role!`,
                ephemeral: true
            } );

        }

    }

}