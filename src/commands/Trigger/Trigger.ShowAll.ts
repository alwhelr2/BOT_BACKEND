import { ChatInputCommandInteraction, userMention, channelMention, APIEmbed } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { Guild, Trigger } from "../../types";
import Pagination from "../../base/classes/Pagination";

export default class TriggerShowAll extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger.showall'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        await interaction.deferReply();
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( interaction.inGuild() ? `/guild/${ interaction.guildId }` : `/dmtriggers` );
            const guildColor = interaction.inGuild() ? guild.themecolor : this.client.defaultGuildThemeColor; 
            const { data: triggers } = await this.client.botAxios.get< Trigger[] >( interaction.inGuild() ? `/guild/${ interaction.guildId }/triggers` : '/dmtriggers' );
            const embeds: APIEmbed[] = triggers.filter( ( trigger: Trigger ) => trigger.guildid === interaction.guildId ).map( ( trigger ) => {

                const desc = `ID: ${ trigger.id }\nText: ${ trigger.text }, Response: ${ trigger.response }, Type: ${ trigger.type }, Enabled: ${ trigger.enabled }${ trigger.triggerbyuser ? `\nUser: ${ userMention( trigger.triggerbyuser ) }` : `` }${ trigger.chance ? `${ trigger.triggerbyuser ? `, `: `\n` }Random Chance: ${ ( 100 / trigger.chance ) }%`: `` }${ trigger.channelid ? `\nChannel: ${ channelMention( trigger.channelid ) }` : `` }`;
                return {
                    title: `Trigger`,
                    description: desc,
                    color: guildColor
                };

            } );

            await new Pagination( embeds, interaction ).DisplayEmbedPagination();
        } catch ( error ) {

            console.log( 'Error showing all triggers!', error );
            await interaction.followUp( {
                content: `Error showing all triggers!`
            } );

        }

    }

}