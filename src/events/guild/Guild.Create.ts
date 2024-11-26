import { Events, Guild } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class GuildCreate extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.GuildCreate,
            description: `Guild create event`,
            once: false
        } );
    }

    Execute( guild: Guild ) {
        
        if ( this.client.guildUpdateLog ) console.log( `GuildCreate`, guild );

    }

}