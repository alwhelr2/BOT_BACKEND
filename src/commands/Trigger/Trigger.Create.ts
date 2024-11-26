/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChatInputCommandInteraction, channelMention, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import TriggerType from "../../base/enums/TriggerType";

export default class TriggerCreate extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger.create'
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {

        const text = interaction.options.getString(  `text` )!;
        const response = interaction.options.getString( `response` )!;
        const type = interaction.options.getString( `type` ) ?? 'Normal';
        const user = interaction.options.getUser( `user` );
        const rng = interaction.options.getInteger( `rng` );
        const channel = interaction.options.getChannel( `channel` );
        const typeEnum = type as TriggerType;
        const fields = [ {
            name: `Text`,
            value: text
        }, {
            name: `Response`,
            value: response
        }, {
            name: `Type`,
            value: type
        } ];
        if ( user ) fields.push( {
            name: `User`,
            value: userMention( user.id )
        } );
        if ( rng )  fields.push( {
            name: 'Random chance',
            value: `${ ( 100 / rng ).toString() }%`
        } );
        if ( channel ) fields.push( {
            name: `Channel`,
            value: channelMention( channel.id )
        } );
        const trigger = {
            text: text,
            response: response,
            type: typeEnum,
            triggerbyuser: user?.id,
            chance: rng ?? 1,
            enabled: true,
            guildid: interaction.guildId ?? undefined,
            channelid: channel?.id ?? undefined
        }
        try {

            const guildColor = interaction.inGuild() ? ( await this.client.botAxios.get( `/guild/${ interaction.guildId }` ) ).data.themecolor : this.client.defaultGuildThemeColor; 
            await this.client.botAxios.post( `/triggers`, trigger );
            await interaction.reply( {
                embeds: [ {
                    title: `Trigger Created!`,
                    fields: fields,
                    color: guildColor
                } ]
            } );

        } catch ( error ) {

            console.log( `Error creating trigger!`, error );

        }
        

    }

}