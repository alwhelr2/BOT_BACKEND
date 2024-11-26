import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import { User } from "../../types";

export default class SetBirthday extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'setbirthday',
            description: `Set your birthday`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: [ {
                name: `month`,
                description: `The month of your birthday`,
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: `January`, value: `January` },
                    { name: `February`, value: `February` },
                    { name: `March`, value: `March` },
                    { name: `April`, value: `April` },
                    { name: `May`, value: `May` },
                    { name: `June`, value: `June` },
                    { name: `July`, value: `July` },
                    { name: `August`, value: `August` },
                    { name: `September`, value: `September` },
                    { name: `October`, value: `October` },
                    { name: `November`, value: `November` },
                    { name: `December`, value: `December` },
                ]
            }, {
                name: `date`,
                description: `The date of your birthday`,
                type: ApplicationCommandOptionType.Integer,
                min_value: 1,
                max_value: 31,
                required: true
            } ]
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const month = interaction.options.getString( `month` )!;
        const date = interaction.options.getInteger( `date` )!;

        await interaction.deferReply();
        const { data: newUser } = await this.client.botAxios.post< User >( `/users`, {
            id: interaction.user.id,
            birthdaymonth: month,
            birthdaydate: date
        } );
        if ( this.client.userUpdateLog )
            console.log( `${ newUser.username }s birthday updated!`, newUser );

        await interaction.followUp( `Your birthday was set to ${ month } ${ date }!` );

    }

}