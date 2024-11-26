import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { ReactionRole } from "../../types";
import { AxiosError } from "axios";

export default class ReactRoleClearAll extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'reactrole.clearall'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        await interaction.deferReply( { ephemeral: true } );

        const message_id = interaction.options.getString( 'message_id' )!;
        const message = await interaction.channel?.messages.fetch( message_id );

        if ( !message ) {

            await interaction.followUp( { content: 'Message not found!', ephemeral: true } );
            return;

        }

        try {

            const { data: reactionroles } = await this.client.botAxios.delete< ReactionRole[] >( `/reactionrole/message/${ message_id }` );
            if ( reactionroles.length === 0 ) {
    
                await interaction.followUp( { content: `No reaction roles on the specified messages found!`, ephemeral: true } );
                return;
    
            }
            for ( const reactionrole of reactionroles ) {
    
                await message.reactions.cache.get( reactionrole.emojiid )?.remove();
    
            }
            await interaction.followUp( {
                content: `Cleared ${ reactionroles.length } reaction roles from the specified message!`,
                ephemeral: true// ,
                // files: [ {
                //     attachment: Buffer.from( JSON.stringify( reactionroles, null, 2 ) ),
                //     name: 'reactionroles.json'
                // } ]
            } );

        } catch ( error ) {

            if ( error instanceof AxiosError && ( error as AxiosError ).response?.status === 404 ) {

                await interaction.followUp( { content: 'No reaction roles found!', ephemeral: true } );
                return;

            }
            console.log( 'Error deleting reaction roles from message!', error );
            await interaction.followUp( {
                content: `Failed to delete reaction roles!`,
                ephemeral: true
            } );

        }

    }

}