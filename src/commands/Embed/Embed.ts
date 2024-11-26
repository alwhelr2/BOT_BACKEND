import { PermissionsBitField, ApplicationCommandOptionType } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Embed extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'embed',
            description: `Embed commands`,
            category: Category.Utilities,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
                name: `build`,
                description: `Build an embed`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `title`,
                    description: `The title of the embed`,
                    type: ApplicationCommandOptionType.String,
                    max_length: 256
                }, {
                    name:`description`,
                    description: `description of the embed`,
                    type: ApplicationCommandOptionType.String,
                    max_length: 4096
                }, {
                    name:`author_name`,
                    description: `Author of the embed`,
                    type: ApplicationCommandOptionType.String,
                    max_length: 256
                }, {
                    name:`author_icon_url`,
                    description: `Author icon url of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`author_url`,
                    description: `Author url of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`color`,
                    description: `Color of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`footer_text`,
                    description: `Footer text of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`footer_icon_url`,
                    description: `Footer icon url of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`image_url`,
                    description: `Image url of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name:`thumbnail_url`,
                    description: `Thumbnail url of the embed`,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `timestamp`,
                    description: `Include timestamp in the embed`,
                    type: ApplicationCommandOptionType.Boolean
                }, {
                    name: `url`,
                    description: `Url of the embed`,
                    type: ApplicationCommandOptionType.String
                } ]
            }, {
                name: `clear`,
                description: `Clears all the component rows`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `id`,
                    description: `The id of the message`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                } ]
            }, {
                name: `addbutton`,
                description: `Adds a button to an embed`,
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `message_id`,
                    description: `ID of the message to add a button to`,
                    required: true,
                    type: ApplicationCommandOptionType.String
                }, {
                    name: `label`,
                    description: `Label on the button`,
                    type: ApplicationCommandOptionType.String,
                    min_length: 1,
                    max_length: 80,
                    required: true
                }, {
                    name: `style`,
                    description: `Style of the button`,
                    type: ApplicationCommandOptionType.Integer,
                    choices: [
                        { name: `Primary`, value: 1 },
                        { name: `Secondary`, value: 2 },
                        { name: `Success`, value: 3 },
                        { name: `Danger`, value: 4 },
                        { name: `Link`, value: 5 }
                    ]
                }, {
                    name: `url`,
                    description: `Url for the link button`,
                    type: ApplicationCommandOptionType.String,
                }, {
                    name: `disabled`,
                    description: `If the button is disabled, defaults to false`,
                    type: ApplicationCommandOptionType.Boolean,
                }, {
                    name: `customid`,
                    description: `The custom id for the button`,
                    type: ApplicationCommandOptionType.String
                } ]
            } ]
        } );

    }
}