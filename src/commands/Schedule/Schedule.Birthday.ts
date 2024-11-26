import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { GuildUser, User } from "../../types";

export default class ScheduleBirthday extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'schedule.birthday'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const dm = interaction.options.getBoolean( `dm` ) ?? false;
        await interaction.deferReply();

        if ( interaction.inGuild() && !dm ) {

            try {

                const { data: guilduser } = await this.client.botAxios.get< GuildUser >( `/guild/${ interaction.guildId }/user/${ interaction.user.id }` );
                const newState = !guilduser.birthdayreminder;
                
                await this.client.botAxios.patch( `/guild/${ interaction.guildId }/user/${ interaction.user.id }`, {
                    birthdayreminder: newState
                } );
                await interaction.followUp( `Birthday reminder set to ${ newState ? `on`: `off` }!` );

            } catch ( error ) {

                console.log( `Error toggling birthday reminder!`, error );
                await interaction.followUp( {
                    content: `Error toggling birthday reminder!!`,
                    ephemeral: true
                } ); 

            }

        } else {

            try {

                const { data: user } = await this.client.botAxios.get< User >( `/user/${ interaction.user.id }` );
                const newState = !user.birthdayreminder;
                
                await this.client.botAxios.post< User >( `/users`, {
                    id: user.id,
                    birthdayreminder: newState
                } );
                await interaction.followUp( `DM birthday reminder set to ${ newState ? `on` : `off` }!` );
    
            } catch ( error ) {
    
                console.log( `Error toggling birthday reminder!`, error );
                await interaction.followUp( {
                    content: `Error toggling birthday reminder!!`,
                    ephemeral: true
                } ); 
    
            }

        }

    }

}