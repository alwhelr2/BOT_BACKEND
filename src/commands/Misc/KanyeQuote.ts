import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class KanyeQuote extends Command {
    
    kanyeAxios: AxiosInstance = axios.create( { baseURL: 'https://api.kanye.rest' } );

    constructor( client: CustomClient ) {
        super( client, {
            name: 'kanyequote',
            description: `Quotes from Mozart in the flesh, aka God`,
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

            const { data: kanyeQuote } = await this.kanyeAxios.get< { quote: string } >( '/' );

            await interaction.followUp(
                `Kanye says: ${ kanyeQuote.quote }`
            );

        } catch ( error ) {

            console.log( `Error fetching Kanye quote!`, error );
            await interaction.followUp( `Error fetching Kanye quote!` );

        }

    }

}