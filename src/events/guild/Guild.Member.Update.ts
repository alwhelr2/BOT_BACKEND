import { Events, GuildMember } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class GuildMemberUpdate extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.GuildMemberUpdate,
            description: `Guild member update event`,
            once: false
        } );
    }

    Execute( oldMember: GuildMember, newMember: GuildMember ) {

        if ( this.client.guildUpdateLog )
            console.log( `Member ${ oldMember.id } updated!`, newMember );

    }

}