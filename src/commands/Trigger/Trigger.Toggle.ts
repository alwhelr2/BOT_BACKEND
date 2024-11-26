import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Trigger } from "../../types";

export default class TriggerToggle extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger.toggle'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const id = interaction.options.getString( 'id' )!.trim();
        try {

            const { data: trigger } = await this.client.botAxios.get< Trigger >( `/trigger/${ id }` );
            const newState = !trigger.enabled;
            
            await this.client.botAxios.patch( `/trigger/${ id }`, {
                enabled: newState ? 1 : 0
            } );
            void interaction.reply( `Trigger ${ id } toggled to ${ newState }!` );

        } catch ( error ) {

            await interaction.reply( {
                content: `Error toggling trigger!`,
                ephemeral: true
            } ); 

        }

    }

}