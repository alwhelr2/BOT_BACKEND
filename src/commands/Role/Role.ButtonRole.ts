import { ChatInputCommandInteraction, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { ButtonRole } from "../../types";
import ButtonRoleType from "../../base/enums/ButtonRoleType";

export default class RoleButtonRole extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.buttonrole`
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {
        
        if ( !interaction.inGuild() ) return;
        await interaction.deferReply( { ephemeral: true } );
        const role_id = interaction.options.getRole( 'role' )!.id;
        const messageid = interaction.options.getString( `messageid` )!;
        const customid = interaction.options.getString( `customid` )!;
        const type = interaction.options.getString( `type` ) ?? 'Add';
        const typeEnum = type as ButtonRoleType;
        try {

            await interaction.channel?.messages.fetch( messageid );
            await this.client.botAxios.post< ButtonRole >( `/guild/${ interaction.guildId }/buttonrole`, {
                customid: customid,
                roleid: role_id,
                messageid: messageid,
                guildid: interaction.guildId,
                type: typeEnum
            } );
            await interaction.followUp( {
                content: `Added ${ customid } button role for ${ roleMention( role_id ) }`,
                ephemeral: true
            } );

        } catch ( error ) {

            console.log( error );
            await interaction.followUp( {
                content: `Failed to create button role!`,
                ephemeral: true
            } );

        }

    }

}