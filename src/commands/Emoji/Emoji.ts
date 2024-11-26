import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
// import EmojiSearchType from "../../base/enums/EmojiSearchType";

export default class Emoji extends Command {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'emoji',
            description: `Emoji commands`,
            category: Category.Fun,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
            //     name: 'kitchen',
            //     description: 'Creates a combo unicode emoji!',
            //     type: ApplicationCommandOptionType.Subcommand,
            //     options: [ {
            //         name: `emoji_a`,
            //         description: `Emoji A`,
            //         type: ApplicationCommandOptionType.String,
            //         required: true
            //     }, {
            //         name: `emoji_b`,
            //         description: `Emoji B to blend ( leave blank to see emoji combo options for emoji_a )`,
            //         type: ApplicationCommandOptionType.String
            //     } ]
            // }, {
            //     name: 'reactroleadd',
            //     description: 'Adds a react role to a message',
            //     type: ApplicationCommandOptionType.Subcommand,
            //     options: [ {
            //         name: 'message_id',
            //         description: 'ID of the message to add the react role to',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: 'emoji',
            //         description: 'Emoji to react with',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: 'role',
            //         description: 'Role to assign when the reaction is selected',
            //         required: true,
            //         type: ApplicationCommandOptionType.Role
            //     } ]
            // }, {
            //     name: 'create',
            //     description: 'Creates a new emoji for the current server',
            //     type: ApplicationCommandOptionType.Subcommand,
            //     options: [ {
            //         name: 'name',
            //         description: 'Name of the emoji to add',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: 'emoji',
            //         description: 'The emoji to add',
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: `attachment`,
            //         description: `The emoji attachment`,
            //         type: ApplicationCommandOptionType.Attachment
            //     } ]
            // }, {
            //     name: 'reactroleaddmany',
            //     description: 'Adds multiple react role to a message',
            //     type: ApplicationCommandOptionType.Subcommand,
            //     options: [ {
            //         name: 'message_id',
            //         description: 'ID of the message to add the react role to',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: 'emoji_roles',
            //         description: 'Emoji reaction role pairs',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     } ]
            // }, {
            //     name: 'search',
            //     description: 'Search for unicode emoji by name',
            //     type: ApplicationCommandOptionType.Subcommand,
            //     options: [ {
            //         name: 'search',
            //         description: 'Search term to use',
            //         required: true,
            //         type: ApplicationCommandOptionType.String
            //     }, {
            //         name: 'search_type',
            //         description: 'How to search for the results',
            //         type: ApplicationCommandOptionType.String,
            //         choices: [
            //             { name: `SearchEmoji`, value: EmojiSearchType.SearchEmoji },
            //             { name: `GetEmojisInCategory`, value: EmojiSearchType.GetEmojisInCategory }
            //         ]
            //     } ]
            // }, {
            //     name: 'getunicodeemojicategories',
            //     description: 'Get all unicode emoji categories',
            //     type: ApplicationCommandOptionType.Subcommand
            // }, {
                name: 'steal',
                description: 'Extracts the emojis from the last 10 messages in the current channel',
                type: ApplicationCommandOptionType.Subcommand
            }, {
                name: 'kitchen',
                description: 'Creates a combo unicode emoji!',
                type: ApplicationCommandOptionType.Subcommand,
                options: [ {
                    name: `emoji_a`,
                    description: `Emoji A`,
                    type: ApplicationCommandOptionType.String,
                    required: true
                }, {
                    name: `emoji_b`,
                    description: `Emoji B to blend ( leave blank to see emoji combo options for emoji_a )`,
                    type: ApplicationCommandOptionType.String
                } ]
            } ]
        } );
    }

}