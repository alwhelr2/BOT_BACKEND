import { AttachmentBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, TextInputStyle } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { getAverageColor } from "fast-average-color-node";
import * as jimp from "jimp";
import { Guild } from "../../types"

export default class EmojiKitchen extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `emoji.kitchen`
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        let guildColor = this.client.defaultGuildThemeColor;
        
        if ( interaction.inGuild() ) {
            try {

                const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
                guildColor = guild.themecolor; 

            } catch ( error ) {

                console.log( `Error fetching guild!`, error );

            }
        }
        const emojisA = interaction.options.getString( 'emoji_a' )!;
        const emojisB = interaction.options.getString( 'emoji_b' );

        const emojiA = this.client.splitter.splitGraphemes( emojisA )[ 0 ];
        const emojiB = this.client.splitter.splitGraphemes( emojisB ?? `` )[ 0 ];
        
        const unicodeEmojiA = emojiA?.match( /\p{Extended_Pictographic}/gu );
        const combo = this.client.emojiDictionary[ emojiA ]?.comboResults[ emojiB ];

        if ( !emojisB ) {

            if ( unicodeEmojiA ) {

                const comboList = this.client.emojiDictionary[ emojiA ]?.combos.join( ' ' );    
                await interaction.reply( {
                    content: comboList ?? `No combos found!`,
                    ephemeral: !comboList ? true : false
                } );
                if ( !combo ) return;
            
            } else {

                await interaction.reply( {
                    content: `No combos found!`,
                    ephemeral: true
                } );
                return;

            }

        }

        if ( !combo ) {

            await interaction.reply( {
                content: `Please provide a valid unicode combination.`,
                ephemeral: true
            } );
            return;
        }

        const result = combo?.url;
        const date = combo?.date;
        const name = combo?.alt;

        const image = await jimp.read( result );
        image.resize( 128, 128 );
        const buffer = await image.getBufferAsync( jimp.MIME_PNG );

        const attachment = new AttachmentBuilder( buffer, { name: `emojiCombo.png` } );
        if ( result && image ) {
            const averageColor = await getAverageColor( result );
            const color = parseInt( `0x${ averageColor.hex.substring( 1 ) }` );
            const invalidColor = Number.isNaN( color );
            await interaction.reply( {
                embeds: [ {
                    description: name,
                    fields: [ {
                        name: `Emoji A`,
                        value: emojiA,
                        inline: true
                    }, {
                        name: `Emoji B`,
                        value: emojiB,
                        inline: true
                    } ],
                    image: {
                        url: `attachment://emojiCombo.png`,
                        width: 128,
                        height: 128
                    },
                    footer: {
                        text: `Date Created`
                    },
                    timestamp: new Date( `${ date.substring( 0, 4 ) }-${ date.substring( 4, 6 ) }-${ date.substring( 6 ) } 00:00:00` ).toISOString(),
                    color: invalidColor ? guildColor : color
                } ],
                files: [ attachment ],
                components: interaction.inGuild() ? [ {
                    type: ComponentType.ActionRow,
                    components: [ {
                        type: ComponentType.Button,
                        custom_id: 'steal',
                        label: `👤Yoink💰`,
                        style: ButtonStyle.Secondary
                    } ]
                } ] : undefined
            } );

            if ( interaction.inGuild() ) {

                const message = await interaction.fetchReply();
                const collector = message.createMessageComponentCollector( {
                    componentType: ComponentType.Button
                } );
                collector.on( 'collect', ( btnInteraction: ButtonInteraction ) => {

                    void btnInteraction.showModal( {
                        title: `Yoink`,
                        customId: `emoji.yoink_${ btnInteraction.id }`,
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
                                placeholder: `${ btnInteraction.message.embeds[ 0 ].description }`
                            } ]
                        } ]
                    } ).then( () => {
                        btnInteraction.awaitModalSubmit( {
                            time: 0,
                            filter: async( i ) => {
                                const filter = i.user.id === interaction.user.id && i.customId === `emoji.yoink_${ btnInteraction.id }`;
                                if ( filter ) await i.deferReply();
                                return filter;
                            }
                        } ).then( async ( modalSubmitInteraction ) => {

                            const newEmojiName = modalSubmitInteraction.fields.getTextInputValue( 'emoji.yoink' );
                            const img_url = btnInteraction.message.embeds[ 0 ].image!.url;

                            // await modalSubmitInteraction.deferReply();
                            interaction.guild?.emojis.create( {
                                attachment: img_url,
                                name: newEmojiName
                            } ).then( ( emoji ) => {

                                void modalSubmitInteraction.followUp( {
                                    embeds: [ {
                                        title: `New Emoji Created!`,
                                        description: `Name: ${ newEmojiName }`,
                                        color: invalidColor ? guildColor : color,
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
                            await message.edit( {
                                components: [ {
                                    type: ComponentType.ActionRow,
                                    components: [ {
                                        type: ComponentType.Button,
                                        custom_id: 'steal',
                                        label: `👤Yoink💰`,
                                        style: ButtonStyle.Secondary,
                                        disabled: true
                                    } ]
                                } ]
                            } );

                        } ).catch( ( error ) => {
                            console.log( `Error submitting modal!`, error );
                        } );
                    } ).catch( ( error ) => {
                        console.log( 'Error showing modal!', error );
                    } );

                } );

            }

        }
        else 
            await interaction.reply( {
                content: `Could not find emoji combination for ${ emojiA } and ${ emojiB }!`,
                ephemeral: true
            } );

    }

}