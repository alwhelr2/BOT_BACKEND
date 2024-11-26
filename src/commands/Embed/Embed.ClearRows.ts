import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class EmbedClearRows extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `embed.clear`
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {
        
        const id = interaction.options.getString( `id` )!;

        await interaction.channel?.messages.fetch( id )
            .then( ( message ) => {

                void message.edit( {
                    components: []
                } ).then( () => {

                    void interaction.reply( {
                        content: `Rows cleared!`,
                        ephemeral: true
                    } );

                } ).catch( ( error ) => {

                    console.log( `Error clearing rows!`, error );
                    void interaction.reply( {
                        content: `Error clearing rows!`,
                        ephemeral: true
                    } );

                } );

            } )
            .catch( ( error ) => {

                console.log( `Error fetching message!`, error );

            } );

    }

}