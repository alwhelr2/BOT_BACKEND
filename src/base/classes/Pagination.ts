import { APIButtonComponentWithCustomId, APIEmbed, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, Message } from "discord.js";

export default class Pagination {

    interaction?: ChatInputCommandInteraction;
    pages: APIEmbed[];
    index: number = 0;
    buttons: ButtonBuilder[] = [];
    extraButtonCallback?: { ( interaction: ButtonInteraction ): void };
    customButtonID?: string;
    message?: Message;
    userId: string;

    constructor( pages: APIEmbed[], interaction?: ChatInputCommandInteraction, message?: Message, extraButton?: { button: APIButtonComponentWithCustomId, callback: { ( interaction: ButtonInteraction ): void } } ) {
        this.interaction = interaction;
        this.message = message;
        this.userId = interaction ? interaction.user.id : message!.author.id;
        this.pages = pages.length > 0 ? pages : [ {} ];
        this.buttons.push( new ButtonBuilder()
            .setCustomId( 'pagination_prev' )
            .setEmoji( '⬅️' )
            .setStyle( ButtonStyle.Primary )
            .setDisabled( true ), new ButtonBuilder()
            .setCustomId( 'pagination_home' )
            .setEmoji( '🏠' )
            .setStyle( ButtonStyle.Danger )
            .setDisabled( true ) );
        if ( extraButton ) { 
            this.buttons.push( ButtonBuilder.from( extraButton.button ) );
            this.extraButtonCallback = extraButton.callback;
            this.customButtonID = extraButton.button.custom_id;
        }
        this.buttons.push( new ButtonBuilder()
            .setCustomId( 'pagination_next' )
            .setEmoji( '➡️' )
            .setDisabled( pages.length <= 1 )
            .setStyle( ButtonStyle.Primary ) );

    }

    async DisplayEmbedPagination() {

        if ( this.interaction && !this.interaction?.deferred && !this.interaction?.replied ) await this.interaction!.deferReply();

        const reply = {
            embeds: [ { 
                ...this.pages[ this.index ],
                footer: {
                    text: `Page ${ this.index + 1 } / ${ this.pages.length } `
                }
            } ],
            components: [ {
                type: ComponentType.ActionRow,
                components: this.buttons
            } ]
        };
        const currentPage = this.interaction ? await this.interaction.editReply( reply ) : await this.message!.reply( reply );

        const collector = currentPage.createMessageComponentCollector( {
            componentType: ComponentType.Button
        } );

        collector.on( 'collect', ( interaction: ButtonInteraction ) => {
            if ( interaction.user.id !== this.userId ) {
                return void interaction.reply( {
                    content: `You can't use these buttons`,
                    ephemeral: true
                } );
            }

            if ( interaction.customId === 'pagination_prev' ) {
                if ( this.index > 0 ) this.index--;
            } else if ( interaction.customId === 'pagination_home' ) this.index = 0;
            else if ( interaction.customId === 'pagination_next' ) {
                if ( this.index < this.pages.length - 1 ) this.index++;
            } else if ( this.extraButtonCallback && interaction.customId === this.customButtonID ) {
                this.extraButtonCallback( interaction );
                return;
            }

            void interaction.deferUpdate();

            if ( this.index === 0 ) this.buttons[ 0 ].setDisabled( true );
            else this.buttons[ 0 ].setDisabled( false );

            if ( this.index === 0 ) this.buttons[ 1 ].setDisabled( true );
            else this.buttons[ 1 ].setDisabled( false );

            if ( this.index === this.pages.length - 1 ) this.buttons[ this.buttons.length - 1 ].setDisabled( true );
            else this.buttons[ this.buttons.length - 1 ].setDisabled( false );

            void currentPage.edit( {
                embeds: [ {
                    ...this.pages[ this.index ],
                    footer: {
                        text: `Page ${ this.index + 1 } / ${ this.pages.length }`
                    }
                } ],
                components: [ {
                    type: ComponentType.ActionRow,
                    components: this.buttons
                } ]
            } );

        } );

        return currentPage;

    }

}