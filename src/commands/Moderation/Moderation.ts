import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Moderation extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'moderation',
            description: `Guild moderation commands`,
            category: Category.Moderation,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 0,
            options: [ {
                name: 'purgechannel',
                description: 'Purges all the messages in a channel',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'channel',
                    description: 'The channel to purge messages from',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                } ]
            }, {
                name: `purgeuser`,
                description: 'Purges all the messages from a specific user',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: 'user',
                    description: 'The user to purge messages of',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }, {
                    name: 'channel',
                    description: 'The channel to purge a specific users messages from',
                    type: ApplicationCommandOptionType.Channel
                } ]
            } ]
        } );
    }

}