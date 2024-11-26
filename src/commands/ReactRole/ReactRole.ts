import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class ReactRole extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'reactrole',
            description: `Reaction role commands`,
            category: Category.Moderation,
            default_member_permissions: PermissionsBitField.Flags.ManageRoles,
            dm_permission: false,
            cooldown: 0,
            options: [ {
                name: 'add',
                description: 'Adds a react role to a message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'message_id',
                    description: 'ID of the message to add the react role to',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: 'emoji',
                    description: 'Emoji to react with',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: 'role',
                    description: 'Role to assign when the reaction is selected',
                    required: true,
                    type: ApplicationCommandOptionType.Role
                } ]
            }, {
                name: 'addmany',
                description: 'Adds multiple react role to a message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'message_id',
                    description: 'ID of the message to add the react role to',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: 'emoji_roles',
                    description: 'Emoji reaction role pairs',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: 'unique',
                    description: 'If members can only pick one role from the message',
                    type: ApplicationCommandOptionType.Boolean
                } ]
            }, {
                name: 'clearall',
                description: 'Clears all react roles from a message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name:'message_id',
                    description: 'ID of the message to clear the react roles from',
                    required: true,
                    type: ApplicationCommandOptionType.String
                } ]
            }, {
                name: 'clear',
                description: 'Clears a specific react role from a message',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name:'message_id',
                    description: 'ID of the message to clear the react role from',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: 'emoji',
                    description: 'Emoji to clear the reaction role from',
                    required: true,
                    type: ApplicationCommandOptionType.String
                } ]
            } ]
        } );
    }
    
}