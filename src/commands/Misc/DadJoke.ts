import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class DadJoke extends Command {

    dadJokeAxios: AxiosInstance = axios.create( { baseURL: `https://icanhazdadjoke.com` } );

    constructor( client: CustomClient ) {
        super( client, {
            name: 'dadjoke',
            description: `Tells you a dad joke`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: []
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        await interaction.deferReply();
        try {

            const { data: jokeResponse } = await this.dadJokeAxios.get< { id: string, joke: string } >( '/', {
                headers: {
                    'Accept': 'application/json'
                }
            } );
            await interaction.followUp( `${ jokeResponse.joke }` );

        } catch ( error ) {

            console.log( `Error fetching dad joke!`, error );
            await interaction.followUp( `Error fetching dad joke!` );

        }


    }

}