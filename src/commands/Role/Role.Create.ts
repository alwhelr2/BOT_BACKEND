import { ChatInputCommandInteraction, Colors, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class RoleCreate extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.create`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {
        
        if ( !interaction.inGuild() ) return;
        const name = interaction.options.getString( `name` )!;
        const color = parseInt( interaction.options.getString( `color` ) ?? `0` );
        const hoist = interaction.options.getBoolean( `hoist` ) ?? false;
        const mentionable = interaction.options.getBoolean( `mentionable` ) ?? true;
        const invalidColor = Number.isNaN( color );

        await interaction.guild?.roles.create( {
            name: name,
            color: invalidColor ? Colors.Default : color,
            hoist: hoist,
            mentionable: mentionable
        } ).then( async ( role ) => {

            await interaction.reply( { content: `${ invalidColor ? `Invalid color provided, default value chosen.\n` : `` }New role ${ roleMention( role.id ) } created!` } );

        } ).catch( async ( error ) => {

            console.log( `Error creating new role!`, error );
            await interaction.reply( { content: `Error creating new role!`, ephemeral: true } );

        } );

    }

}