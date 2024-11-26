import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField, userMention } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class Compliment extends Command {

    complimentAxios: AxiosInstance = axios.create( { baseURL: `https://my-fun-api.onrender.com` } );

    constructor( client: CustomClient ) {
        super( client, {
            name: 'compliment',
            description: 'Compliment command',
            category: Category.Fun,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
                name: `user`,
                description: `The user to compliment`,
                type: ApplicationCommandOptionType.User
            } ]
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const user = interaction.options.getUser( `user` );
        await interaction.deferReply();

        try {

            const { data: compliment } = await this.complimentAxios.get< { success: boolean, data: { compliment: string } } >( '/compliment' );
            if ( compliment.success ) await interaction.followUp( `${ userMention( user?.id ?? interaction.user.id ) }: ${ user ? `${ userMention( interaction.user.id ) } says ` : `` } ${ compliment.data.compliment }` );
            else interaction.followUp( `Error fetching compliment!` );

        } catch ( error ) {

            console.log( `Error fetching compliment!`, error );
            await interaction.followUp( `Error fetching compliment!` );

        }

    }

}