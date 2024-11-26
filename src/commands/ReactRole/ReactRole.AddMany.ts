import { ChatInputCommandInteraction, parseEmoji } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { ReactionRole } from "../../types";

export default class ReactRoleAddMany extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'reactrole.addmany'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {
    
        if ( !interaction.inGuild() ) return;
        await interaction.deferReply( { ephemeral: true } );
        const message_id = interaction.options.getString( 'message_id' )!;
        const emoji_roles = interaction.options.getString( 'emoji_roles' )!;
        const unique = interaction.options.getBoolean( 'unique' ) ?? true;
        const message = await interaction.channel?.messages.fetch( message_id ).catch( () => {} );

        const matches = [ ...emoji_roles.matchAll( /((?<unicode_emoji>\p{Extended_Pictographic})|(?<custom_emoji><a?:(\w|_)*:\d{17,19}>)).?(?<role><@&\d{17,19}>)/gu ) ].filter( ( match ) => {

            return ( ( !match.groups?.custom_emoji && match.groups?.unicode_emoji ) || ( match.groups?.custom_emoji && this.client.emojis.cache.get( parseEmoji( match.groups?.custom_emoji ?? `` )?.id ?? `` ) ) ) && match.groups?.role;

        } );

        if ( !message || matches.length === 0 ) {

            await interaction.followUp( { content: ( matches.length === 0 && !message ) ? 'Invalid emoji role pairs and message id provided.' : ( matches.length === 0 ? 'Invalid emoji role pairs provided.' : 'Invalid message id provided.' ), ephemeral: true } );
            return;

        }
   
        for ( const match of matches ) {

            let emoji;
            let fetchedEmoji;
            if ( match.groups?.custom_emoji ) {

                fetchedEmoji = this.client.emojis.cache.get( parseEmoji( match.groups.custom_emoji ?? `` )?.id ?? `` );
                
                if ( fetchedEmoji ) {

                    await message?.react( fetchedEmoji.id );
                    emoji = fetchedEmoji.id;

                }

            } else if ( match.groups?.unicode_emoji ) {

                await message?.react( match.groups.unicode_emoji );
                emoji = match.groups.unicode_emoji;

            }

            try {
                
                await this.client.botAxios.post< ReactionRole >( `/guild/${ interaction.guildId }/reactionrole`, {
                    emojiid: emoji,
                    roleid: match.groups!.role.match( /\d{17,19}/gu )![ 0 ],
                    messageid: message_id,
                    guildid: interaction.guildId,
                    uniquereact: unique
                } );
                
    
            } catch ( error ) {
    
                console.log( error );
                await interaction.followUp( {
                    content: `Failed to react with the given emoji!`,
                    ephemeral: true
                } );
    
            }

        }

        await interaction.followUp( {
            content: `Added ${ JSON.stringify( matches.map( ( match ) => {
                return {
                    emoji: ( match.groups?.unicode_emoji?? match.groups?.custom_emoji )!,
                    role: match.groups!.role
                };
            } ) ) } reaction roles!`,
            ephemeral: true
        } );

    }


}