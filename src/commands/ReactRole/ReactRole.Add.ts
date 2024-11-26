import { ChatInputCommandInteraction, parseEmoji, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { ReactionRole } from "../../types";
import { getCustomEmojis, getUnicodeEmojis } from "../../UtilityMethods";

export default class ReactRoleAdd extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'reactrole.add'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        await interaction.deferReply( { ephemeral: true } );
        const emojiString = interaction.options.getString( 'emoji' )!;
        const message_id = interaction.options.getString( 'message_id' )!;
        const role_id = interaction.options.getRole( 'role' )!.id;

        const emojis = [ ...( getCustomEmojis( emojiString ) ?? [] ), ...( getUnicodeEmojis( emojiString ) ?? [] ) ];
        const message = await interaction.channel?.messages.fetch( message_id );
        if ( !emojis || !message ) {
            await interaction.followUp( {
                content: ( !emojis && !message ) ? 'Invalid emoji and message id provided.' : ( !emojis ? 'Invalid emoji provided.' : 'Invalid message id provided.' ),
                ephemeral: true
            } );
            return;
        }
        
        const emoji = parseEmoji( emojis[ 0 ][ 0 ] );
        try {

            await message.react( emojis[ 0 ][ 0 ] );
            
            await this.client.botAxios.post< ReactionRole >( `/guild/${ interaction.guildId }/reactionrole`, {
                emojiid: emoji?.id ?? emoji?.name,
                roleid: role_id,
                messageid: message_id,
                guildid: interaction.guildId,
                uniquereact: false
            } );
            await interaction.followUp( {
                content: `Added ${ emojis[ 0 ].toString() } with the role ${ roleMention( role_id ) }`,
                ephemeral: true
            } );

        } catch ( error ) {

            console.log( error );
            await interaction.followUp( {
                content: `Failed to react with the given emoji!`,
                ephemeral: true
            } );

        }

    }

}