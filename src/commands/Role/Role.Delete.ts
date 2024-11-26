import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class RoleDelete extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.delete`
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {

        const role = interaction.options.getRole( `role` )!;

        await interaction.guild?.roles.cache.get( role.id )?.delete()
            .then( ( role ) => {

                void interaction.reply( `Deleted the role ${ role.name }` );

            } )
            .catch( ( error ) => {

                console.log( `Failed to delete the role!`, error );
                void interaction.reply( `Failed to delete the role!` );

            } );
        
    }

}