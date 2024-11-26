import { ChatInputCommandInteraction, roleMention, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class RoleAdd extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.add`
        } );
    }
    
    async Execute( interaction?: ChatInputCommandInteraction, aliasOptions?: { user: string, role: string } ) {
        
        if ( !interaction?.inGuild() ) return;
        const user = interaction.options?.getUser( `user` );
        const role = interaction.options?.getRole( `role` );

        await interaction.guild?.members.cache.get( aliasOptions?.user ?? user?.id ?? `` )?.roles.add( aliasOptions?.role ?? role?.id ?? `` )
            .then( ( user ) => {

                if ( !aliasOptions ) void interaction.reply( {
                    content: `Successfully added ${ roleMention( role?.id ?? `` ) } to ${ userMention( user.id ) }`,
                    ephemeral: true
                } );

            } ).catch( ( error ) => {

                console.log( `Error adding role to user!`, error );
                if ( !aliasOptions ) void interaction.reply( {
                    content: `Error adding role to user!`,
                    ephemeral: true
                } );
                
            } );

    }

}