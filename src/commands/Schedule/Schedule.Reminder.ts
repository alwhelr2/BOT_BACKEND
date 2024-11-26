import { channelMention, ChatInputCommandInteraction, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

export default class ScheduleReminder extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: 'schedule.reminder'
        } );

    }

    async Execute( interaction: ChatInputCommandInteraction ) {
    
        const reminder = interaction.options.getString( `reminder` )!;
        const minutes = interaction.options.getInteger( `minutes` )!;
        const seconds = interaction.options.getInteger( `seconds` )!;
        const hours = interaction.options.getInteger( `hours` )!;
        const dm = interaction.inGuild() ? interaction.options.getBoolean( `dm` ) ?? false : true;
        const channelId = interaction.options.getChannel( `channel` )?.id ?? interaction.channelId;
        const user = await this.client.users.fetch( interaction.user.id );
        const channel = await ( await interaction.guild?.fetch() )?.channels.fetch( channelId );

        const millisecondsUntilReminder = seconds * 1000 + minutes * 60000 + hours * 3600000;
        
        await interaction.reply( `Set a reminder for ${ userMention( interaction.user.id ) } in${ hours > 0 ? ` ${ hours } ${ hours > 1 ? `hours`: `hour` }`: `` } ${ minutes } ${ minutes !== 1 ? `minutes` : `minute` }${ seconds > 0 ? ` ${ seconds } ${ seconds > 1 ? `seconds` : `second` }` : `` } in ${ dm ? `dms` : channelMention( channelId ) }!` );
        setTimeout( function() {

            if ( dm ) {

                user.send( `Reminder: \`${ reminder }\`` );

            } else {

                if ( channel?.isSendable() )
                    channel.send( `Reminder for ${ userMention( user.id ) }: \`${ reminder }\`` );

            }
                
        }, millisecondsUntilReminder );

    }

}