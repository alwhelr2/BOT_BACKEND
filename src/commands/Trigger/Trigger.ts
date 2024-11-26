import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import TriggerType from "../../base/enums/TriggerType";

export default class Trigger extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger',
            description: `Trigger commands`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
                name: `create`,
                description: `Creates a new trigger`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `text`,
                    description: `The text to trigger the response with`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `response`,
                    description: `What to respond to the trigger with`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `type`,
                    description: `The type of trigger`,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: `Normal match`, value: TriggerType.Normal },
                        { name: `Strict match`, value: TriggerType.Strict },
                        { name: `Exact match`, value: TriggerType.Exact },
                        { name: `Starts with`, value: TriggerType.StartsWith },
                        { name: `Ends with`, value: TriggerType.EndsWith }
                    ]
                }, {
                    name: `user`,
                    description: `The user to restrict the trigger to`,
                    type: ApplicationCommandOptionType.User
                }, {
                    name: `rng`,
                    description: `Give the trigger a 1/rng random chance of activating`,
                    type: ApplicationCommandOptionType.Integer
                }, {
                    name: `channel`,
                    description: `The channel to restrict the trigger to`,
                    type: ApplicationCommandOptionType.Channel
                } ]
            }, {
                name: `showall`,
                description: `Show all triggers`,
                type: ApplicationCommandOptionType.Subcommand
            }, {
                name: 'toggle',
                description: 'Toggles a trigger',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'id',
                    description: 'The id of the trigger to toggle',
                    type: ApplicationCommandOptionType.String,
                    required: true
                } ]
            }, {
                name: 'delete',
                description: 'Deletes a trigger',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'id',
                    description: 'The id of the trigger to delete',
                    type: ApplicationCommandOptionType.String,
                    required: true
                } ]
            }, {
                name: `edit`,
                description: `Edits a trigger`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `id`,
                    description: `The id of the trigger`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `text`,
                    description: `The text to trigger the response with`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `type`,
                    type: ApplicationCommandOptionType.String,
                    description: `The type of trigger`,
                    choices: [
                        { name: `Normal match`, value: TriggerType.Normal },
                        { name: `Strict match`, value: TriggerType.Strict },
                        { name: `Exact match`, value: TriggerType.Exact },
                        { name: `Starts with`, value: TriggerType.StartsWith },
                        { name: `Ends with`, value: TriggerType.EndsWith }
                    ]
                }, {
                    name: `response`,
                    description: `What to respond to the trigger with`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `user`,
                    description: `The user to restrict the trigger to`,
                    type: ApplicationCommandOptionType.User
                }, {
                    name: `rng`,
                    description: `Give the trigger a 1/rng random chance of activating`,
                    type: ApplicationCommandOptionType.Integer
                }, {
                    name: `channel`,
                    description: `The channel to restrict the trigger to`,
                    type: ApplicationCommandOptionType.Channel
                }, {
                    name: `clearguild`,
                    description: 'Clears the guild restriction from the trigger, making it DM-only',
                    type: ApplicationCommandOptionType.Boolean
                }, {
                    name: `clearuser`,
                    description: 'Clears the user restriction from the trigger',
                    type: ApplicationCommandOptionType.Boolean
                }, {
                    name: `clearchannel`,
                    description: 'Clears the channel restriction from the trigger',
                    type: ApplicationCommandOptionType.Boolean
                } ]
            } ]
        } );
    }

}