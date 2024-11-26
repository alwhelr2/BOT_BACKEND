import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { AxiosError } from "axios";
import TriggerType from "../../base/enums/TriggerType";
import { Trigger } from "../../types";

export default class TriggerEdit extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'trigger.edit'
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const id = interaction.options.getString( `id` )!.trim();
        const type = interaction.options.getString( `type` );
        const response = interaction.options.getString( `response` );
        const user = interaction.options.getUser( `user` );
        const rng = interaction.options.getInteger( `rng` );
        const text = interaction.options.getString( `text` );
        const channel = interaction.options.getChannel( `channel` );
        const clearGuild = interaction.options.getBoolean( 'clearguild' );
        const clearUser = interaction.options.getBoolean( 'clearuser' );
        const clearChannel = interaction.options.getBoolean( 'clearchannel' );

        await interaction.deferReply();
        const notifyString = `${ user && clearUser ? `Clear user setting overriding provided user!\n` : `` }${ channel && clearChannel ? `Clear channel setting overriding provided channel!` : `` }`;
        try {

            const { data: trigger } = await this.client.botAxios.get< Trigger >( `/trigger/${ id }` );
            trigger.type = ( type as TriggerType ) ?? trigger.type;
            trigger.response = response ?? trigger.response;
            trigger.triggerbyuser = clearUser ? null : ( user?.id ?? trigger.triggerbyuser );
            trigger.chance = rng ?? trigger.chance;
            trigger.text = text ?? trigger.text;
            trigger.channelid = clearChannel ? null : ( channel?.id ?? trigger.channelid );
            trigger.guildid = clearGuild ? null : trigger.guildid;

            await this.client.botAxios.patch( `/trigger/${ id }`, {
                ...trigger
            } );
            await interaction.followUp( {
                content: `Trigger ${ id } updated!${ notifyString }`
            } );

        } catch ( error ) {

            console.log( `Error editing trigger!`, error );
            await interaction.reply( {
                content: `Error editing trigger!`,
                ephemeral: true
            } );

        }

    }

}