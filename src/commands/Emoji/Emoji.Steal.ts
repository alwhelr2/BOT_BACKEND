import { APIEmbed, ChatInputCommandInteraction, ComponentType, PartialEmoji, TextInputStyle, parseEmoji } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { getCustomEmojis } from "../../UtilityMethods";
import Pagination from "../../base/classes/Pagination";
import { Guild } from "../../types";

export default class EmojiSteal extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `emoji.steal`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.channel?.isTextBased() || !interaction.inGuild() ) return;
        const { data: currentGuild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
        const currentGuildColor = currentGuild.themecolor;

        const messages = await interaction.channel.messages.fetch( { limit: 10 } );
        const embeds: APIEmbed[] = [];
        const customEmojis: PartialEmoji[] = [];
        [ ...messages.values() ].forEach( ( message ) => {

            const messageEmojis = [ ...getCustomEmojis( message.content ) ].filter( ( result ) => parseEmoji( result[ 0 ] )?.id ).map( ( result ) => {
                return parseEmoji( result[ 0 ] )!;
            } );
            customEmojis.push( ...messageEmojis );
            [ ...message.reactions.cache.values() ].forEach( ( messageReact ) => {                
                if ( messageReact.emoji.id ) customEmojis.push( messageReact.emoji as PartialEmoji );
            } );

        } );

        for ( let i = 0; i < customEmojis.length; i++ ) {

            const emoji = customEmojis[ i ];
            if ( !emoji.id || !emoji.name ) continue;
            const emojiURL = `https://cdn.discordapp.com/emojis/${ emoji.id }${ emoji.animated ? `.gif`: `` }`;
            embeds.push( {
                title: `Steal Emojis:`,
                description: `**EMOJI** \`${ emoji.name }\` ${ emoji.id }`,
                author: {
                    name: `Enlarged Emoji!`,
                    url: emojiURL,
                    icon_url: this.client.user?.avatarURL() ?? `https://cdn.discordapp.com/embed/avatars/0.png`
                },
                image: {
                    url: emojiURL,
                    width: 128,
                    height: 128
                },
                footer: {
                    text: `page ${ i + 1 }/${ customEmojis.length }`
                },
                color: currentGuildColor
            } );

        }

        await new Pagination( embeds.length === 0 ? [ {
            title: `Steal Emojis:`
        } ] : embeds, interaction, undefined, { button: {
            type: 2,
            custom_id: 'steal',
            label: `👤Yoink💰`,
            style: 2,
            disabled: embeds.length === 0
        }, callback: ( interaction ) => {

            const { name } = [ ...interaction.message.embeds[ 0 ].description!.matchAll( /`(?<name>\w+)` (?<id>\d{17,19})/g ) ][ 0 ].groups!;

            void interaction.showModal( {
                title: `Yoink`,
                customId: `emoji.yoink_${ interaction.id }`,
                components: [ {
                    type: 1,
                    components: [ {
                        type: ComponentType.TextInput,
                        style: TextInputStyle.Short,
                        label: `Emoji name`,
                        customId: `emoji.yoink`,
                        minLength: 1,
                        maxLength: 32,
                        required: true,
                        placeholder: name
                    } ]
                } ]
            } ).then( () => {
                interaction.awaitModalSubmit( {
                    time: 0,
                    filter: async( i ) => {
                        const filter = i.user.id === interaction.user.id && i.customId === `emoji.yoink_${ interaction.id }`;
                        if ( filter ) await i.deferReply();
                        return filter;
                    }
                } ).then( async ( modalSubmitInteraction ) => {

                    const newEmojiName = modalSubmitInteraction.fields.getTextInputValue( 'emoji.yoink' );
                    const img_url = interaction.message.embeds[ 0 ].image!.url;

                    // await modalSubmitInteraction.deferReply();
                    interaction.guild?.emojis.create( {
                        attachment: img_url,
                        name: newEmojiName
                    } ).then( ( emoji ) => {

                        void modalSubmitInteraction.followUp( {
                            embeds: [ {
                                title: `New Emoji Created!`,
                                description: `Name: ${ newEmojiName }`,
                                color: currentGuildColor,
                                fields: [ {
                                    name: `Emoji`,
                                    value: emoji.toString()
                                } ]
                            } ]
                        } );

                    } ).catch( ( error ) => {

                        console.log( `Error creating new emoji!`, error );
                        void modalSubmitInteraction.followUp( {
                            content: `Error creating new emoji!`
                        } );

                    } );
                } ).catch( ( error ) => {
                    console.log( `Error submitting modal!`, error );
                } );
            } ).catch( ( error ) => {
                console.log( `Error showing modal!`, error );
            } );

        } } ).DisplayEmbedPagination();

    }

}