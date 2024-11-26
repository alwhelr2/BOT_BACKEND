import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Schedule extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'schedule',
            description: 'Scheduling commands',
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
                name: `birthday`,
                description: `Toggles birthday reminder for a user`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `dm`,
                    description: `Whether or not to toggle the reminder for the dms (will always be true when ran in dms)`,
                    type: ApplicationCommandOptionType.Boolean
                } ]
            }, {
                name: `reminder`,
                description: `Sets a reminder`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `seconds`,
                    description: `How long in seconds you would like to be reminded`,
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 0
                }, {
                    name: `minutes`,
                    description: `How long in minutes you would like to be reminded`,
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 0
                }, {
                    name: `hours`,
                    description: `How long in hours you would like to be reminded`,
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 0
                }, {
                    name: `reminder`,
                    description: `What you would like to be reminded of`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `channel`,
                    description: `The channel to send the reminder in`,
                    type: ApplicationCommandOptionType.Channel
                }, {
                    name: `dm`,
                    description: `Whether or not to dm the reminder`,
                    type: ApplicationCommandOptionType.Boolean
                } ]
            } ]
        } );
    }

}