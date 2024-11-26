import { ChatInputCommandInteraction, roleMention, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class RoleRemove extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.remove`
        } )
    }
    
    async Execute( interaction: ChatInputCommandInteraction, aliasOptions?: { user: string, role: string } ) {

        if ( !interaction.inGuild() ) return;
        const role = interaction.options?.getRole( `role` );
        const user = interaction.options?.getUser( `user` );

        await interaction.guild?.members.cache.get( aliasOptions?.user ?? user?.id ?? `` )?.roles.remove( aliasOptions?.role ?? role?.id ?? `` )
            .then( ( user ) => {

                if ( !aliasOptions ) void interaction.reply( { content: `Role ${ roleMention( role?.id ?? `` ) } removed from ${ userMention( user.id ) }` } );

            } )
            .catch( ( error ) => {

                console.log( `Error removing role from user!`, error );
                if ( !aliasOptions ) void interaction.reply( { content: `Error removing role from user!`, ephemeral: true } );

            } );
        
    }

}