/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { AxiosError } from "axios";

export default class TriggerDelete extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger.delete'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const id = interaction.options.getString( 'id' )!.trim();
        try {

            await this.client.botAxios.delete( `/trigger/${ id }` );
            await interaction.reply( {
                content: `Trigger ${ id } deleted!`
            } );

        } catch ( error ) {

            await interaction.reply( {
                content: `Error deleting trigger!`,
                ephemeral: true
            } );

        }

    }

}