import { PermissionsBitField, ApplicationCommandOptionType } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import ButtonRoleType from "../../base/enums/ButtonRoleType";

export default class Role extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'role',
            description: `Role commands`,
            category: Category.Moderation,
            default_member_permissions: PermissionsBitField.Flags.ManageRoles,
            dm_permission: false,
            cooldown: 0,
            options: [ {
                name: `create`,
                description: `Creates a role`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `name`,
                    description: `The name of the role`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                },{
                    name: `color`,
                    description: `The color for the role`,
                    type: ApplicationCommandOptionType.String
                },{
                    name: `mentionable`,
                    description: `Whether or not the role is mentionable`,
                    type: ApplicationCommandOptionType.Boolean
                },{
                    name: `hoist`,
                    description: `Whether or not to hoist the role`,
                    type: ApplicationCommandOptionType.Boolean
                } ]
            }, {
                name: `add`,
                description: `Adds a role to a member`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `user`,
                    description: `The member to add the role to`,
                    required: true,
                    type: ApplicationCommandOptionType.User
                }, {
                    name: `role`,
                    description: `The role to add`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: `remove`,
                description: `Removes a role from a member`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `user`,
                    description: `The member to remove the role from`,
                    required: true,
                    type: ApplicationCommandOptionType.User
                }, {
                    name: `role`,
                    description: `The role to remove`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: `addto`,
                description: `Adds a role to all members currently in a role`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `role`,
                    description: `The role to add`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                }, {
                    name: `add_to`,
                    description: `Which members to add to this role`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: `showmembers`,
                description: `Show all the members currently with a role`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `role`,
                    description: `The role to display members of`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: `showall`,
                description: `Show all roles in the current guild`,
                type: ApplicationCommandOptionType.Subcommand
            }, {
                name: `delete`,
                description: `Deletes a role`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `role`,
                    description: `The role to delete`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: `buttonrole`,
                description: `Creates a button role`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `role`,
                    description: `The role to apply when the button is clicked`,
                    required: true,
                    type: ApplicationCommandOptionType.Role
                }, {
                    name: `messageid`,
                    description: `The message check for button clicks on`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `customid`,
                    description: `The customid of the button`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `type`,
                    description: `The type of button role, either add or remove`,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: `Add`, value: ButtonRoleType.Add },
                        { name: `Remove`, value: ButtonRoleType.Remove }
                    ]
                } ]
            } ]
        } );

    }
}