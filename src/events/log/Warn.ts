import { Events } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class Warn extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.Warn,
            description: "Warn event",
            once: false
        } );
    }

    Execute(  info: string  ) {

        if ( this.client.debugLog )
            console.info( `Warn`, info );

    }

}