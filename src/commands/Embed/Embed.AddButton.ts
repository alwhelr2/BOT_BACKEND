/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { APIButtonComponent, APIButtonComponentWithCustomId, APIButtonComponentWithURL, ButtonStyle, ChatInputCommandInteraction, ComponentType, SnowflakeUtil } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class EmbedAddButton extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `embed.addbutton`
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {

        const message_id = interaction.options.getString( `message_id` )!;
        const style = interaction.options.getInteger( `style` ) ?? 1;
        const label = interaction.options.getString( `label` )!;
        const url = interaction.options.getString( `url` ) ?? ``;
        const disabled = interaction.options.getBoolean( `disabled` ) ?? false;
        const customid = interaction.options.getString( `customid` ) ?? SnowflakeUtil.generate().toString();

        if ( style === ButtonStyle.Link && !url ) {

            await interaction.reply( {
                content: `A link-style button requires a url parameter`,
                ephemeral: true
            } );
            return;

        }

        const message = await interaction.channel?.messages.fetch( message_id ).catch( ( error ) => {

            console.log( `Error fetching message!`, error );

        } );

        if ( message ) {

            const buttonComponent: APIButtonComponentWithCustomId | APIButtonComponentWithURL = ( style === ButtonStyle.Link ? {
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: label,
                url: url,
                disabled: disabled
            } : {
                type: ComponentType.Button,
                style: style,
                label: label,
                disabled: disabled,
                custom_id: customid
            } );
            let foundRowIndex;
            const rowButtons: APIButtonComponent[] = [];
            message.components.forEach( ( row, index ) => {

                if ( row.type === ComponentType.ActionRow && row.components.length < 5 && !row.components.some( ( row ) => row.type !== ComponentType.Button ) ) {

                    foundRowIndex = index;
                    row.components.forEach( ( rowComponent ) => {

                        if ( rowComponent.type === ComponentType.Button ) {

                            if ( rowComponent.style === ButtonStyle.Link ) {

                                rowButtons.push( {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Link,
                                    label: rowComponent.label!,
                                    url: rowComponent.url!,
                                    disabled: rowComponent.disabled
                                } );

                            } else if ( rowComponent.style === ButtonStyle.Primary || rowComponent.style === ButtonStyle.Secondary || rowComponent.style === ButtonStyle.Danger || rowComponent.style === ButtonStyle.Success ) {

                                rowButtons.push( {
                                    type: ComponentType.Button,
                                    style: rowComponent.style,
                                    label: rowComponent.label!,
                                    disabled: rowComponent.disabled,
                                    custom_id: rowComponent.customId!
                                } );

                            }

                        }

                    } );

                }

            } );
            foundRowIndex = foundRowIndex ?? 4;

            await message.edit( {
                components: [ ...message.components.slice( 0, foundRowIndex ), {
                    type: ComponentType.ActionRow,
                    components: [ ...rowButtons, buttonComponent ]
                } ]
            } ).then( () => {
                void interaction.reply( {
                    content: `Added button!`,
                    ephemeral: true
                } );
            } ).catch( ( error ) => {

                console.log( `Error adding button!`, error );
                void interaction.reply( {
                    content: `Error adding button!`,
                    ephemeral: true
                } );

            } );

        } else {

            await interaction.reply( {
                content: `No corresponding message in the current channel was found`,
                ephemeral: true
            } );

        }
        
    }

}