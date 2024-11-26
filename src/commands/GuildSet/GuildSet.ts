import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class GuildSet extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'guildset',
            description: `Guild setting commands`,
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 0,
            options: [ {
                name: 'alias',
                description: 'Sets the guild command alias',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'alias',
                    description: 'The command alias character for the guild',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    max_length: 1
                } ]
            }, {
                name: 'themecolor',
                description: 'Sets the guild theme color',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'color',
                    description: 'The hex color code for the guild',
                    type: ApplicationCommandOptionType.String,
                    required: true
                } ]
            }, {
                name: 'joinleavelogchannel',
                description: 'Sets the guilds join/leave logging channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'channel',
                    description: 'The channel to send the join/leave logs to',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                } ]
            }, {
                name: 'messagelogchannel',
                description: 'Sets the guilds message logging channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'channel',
                    description: 'The channel to send the message logs to',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                } ]
            }, {
                name: 'joinrole',
                description: 'Sets the role to apply to members when they join',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'role',
                    description: 'The role to apply when a new member joins',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                } ]
            }, {
                name: 'birthdaychannel',
                description: 'Sets the guilds birthday announcement channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'channel',
                    description: 'The channel to send the birthday announcements to',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                } ]
            }, {
                name: 'starboardchannel',
                description: 'Sets the guilds starboard channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'channel',
                    description: 'The channel to send starboard messages to',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                } ]
            }, {
                name: 'starboardlimit',
                description: 'Sets the guilds starboard channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'limit',
                    description: 'The number of stars needed for a message to make the starboard',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1
                } ]
            }, {
                name: 'starboardtoggle',
                description: 'Toggles the guilds starboard on/off',
                type: ApplicationCommandOptionType.Subcommand
            }, {
                name: 'starboardselfstartoggle',
                description: 'Toggles the guilds starboard self star setting',
                type: ApplicationCommandOptionType.Subcommand
            } ]
        } );
    }

}