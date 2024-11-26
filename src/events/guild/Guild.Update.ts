import { Events, Guild } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { differenceInObj } from "../../UtilityMethods";

export default class GuildUpdate extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.GuildUpdate,
            description: `Guild update event`,
            once: false
        } );
    }

    Execute( oldGuild: Guild, newGuild: Guild ) {

        // if ( newGuild.iconURL() !== oldGuild.iconURL() || newGuild.name !== oldGuild.name || newGuild.ownerId !== oldGuild.ownerId ) {

        //     try {

        //         await this.client.botAxios.patch( `/guild/${ newGuild.id }`, {
        //             name: newGuild.name,
        //             owner: newGuild.ownerId,
        //             iconURL: newGuild.iconURL()
        //         } );

        //     } catch ( error ) {

        //         console.log( `Error updating guild!`, error );

        //     }

        // }

        if ( this.client.guildUpdateLog )
            console.log( `Guild ${ oldGuild.id } updated!`, differenceInObj< Guild >( oldGuild, newGuild ) );

    }

}