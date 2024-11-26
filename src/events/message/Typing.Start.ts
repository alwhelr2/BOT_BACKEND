import { Events, Typing } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class TypingStart extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.TypingStart,
            description: `Typing start event`,
            once: false
        } );
    }

    Execute( typing: Typing ) {

        if ( this.client.guildUpdateLog ) 
            console.log( `Member ${ typing.user.id } started typing in ${ typing.inGuild() ? `${ typing.guild.name }#${ typing.channel.name }` : `DMS` } at ${ typing.startedAt.toUTCString() }!` );

    }

}